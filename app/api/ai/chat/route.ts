import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { generateNaturalJapaneseResponse } from "@/lib/naturalSenseiEngine";
import { rateLimit, rateLimited } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const convId = searchParams.get("conversationId");

  if (convId) {
    const conv = await prisma.aiConversation.findFirst({
      where: { id: convId, userId: uid },
      // Most recent messages matter; the oldest-first ordering lost the thread.
      include: { messages: { orderBy: { createdAt: "desc" }, take: 200 } },
    });
    if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...conv, messages: [...conv.messages].reverse() });
  }

  // Return list of conversations
  const conversations = await prisma.aiConversation.findMany({
    where: { userId: uid },
    include: { messages: { take: 1, orderBy: { createdAt: "desc" } } },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  return NextResponse.json({ conversations });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // One request can fan out to ~30 sequential upstream calls. Cap it per user so
  // the API quota cannot be burned or a worker hung past its timeout.
  const limit = rateLimit(`ai-chat:${uid}`, 20, 60_000);
  if (!limit.ok) return rateLimited(limit.retryAfterSeconds);

  const body = await req.json().catch(() => ({}));
  const { message, conversationId, apiKey, scenarioId, history: clientHistory } = body as {
    message?: string;
    conversationId?: string;
    apiKey?: string;
    scenarioId?: string;
    history?: { role: "user" | "assistant"; content: string }[];
  };

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  // A 10 MB body was persisted verbatim into AiConversation.
  if (message.length > 4000) {
    return NextResponse.json({ error: "Message quá dài (tối đa 4000 ký tự)." }, { status: 400 });
  }

  // Get or create conversation
  let conv = conversationId
    ? await prisma.aiConversation.findFirst({ where: { id: conversationId, userId: uid } })
    : null;

  if (!conv) {
    conv = await prisma.aiConversation.create({
      data: {
        userId: uid,
        title: message.slice(0, 60),
        provider: "NATURAL_KAIWA_ENGINE",
        model: "aoi-sensei-n3",
      },
    });
  }

  // Save user message
  await prisma.aiMessage.create({
    data: { conversationId: conv.id, role: "user", content: message.trim() },
  });

  // Generate AI response
  let aiResponse = "";

  // 1. Extract and normalize Multi-Key Pool (supports multiple keys separated by comma, space, or newline)
  const rawKeyString = [
    apiKey,
    req.headers.get("x-gemini-key"),
    req.headers.get("x-groq-key"),
    process.env.GROQ_API_KEY,
    process.env.GEMINI_API_KEY,
  ]
    .filter(Boolean)
    .join("\n");
  const keyList = Array.from(
    new Set(rawKeyString.split(/[\s,;\n]+/).map((k) => k.trim()).filter((k) => k.length > 5))
  );

  if (keyList.length > 0) {
    try {
      // Fetch the most recent 20 past turns. `asc` + `take` returned the OLDEST
      // 20, so long conversations lost all recent context.
      const dbHistory = await prisma.aiMessage.findMany({
        where: { conversationId: conv.id },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
      dbHistory.reverse();

      // Client-supplied history is untrusted and could fabricate the assistant
      // side of the conversation, so cap its length.
      const trustedClientHistory = Array.isArray(clientHistory)
        ? clientHistory.slice(-20).filter((m) => typeof m?.content === "string")
        : [];

      // Combine clientHistory (including initial scenario greetings) with dbHistory
      const history: { role: string; content: string }[] =
        trustedClientHistory.length > 0
          ? [...trustedClientHistory, { role: "user", content: message.trim() }]
          : [...dbHistory.map((m) => ({ role: m.role, content: m.content })), { role: "user", content: message.trim() }];

      const baseInstruction =
        scenarioId === "business_horenso"
          ? "Bạn là Tanaka Senpai (hoặc Aoi Sensei) tại công ty Nhật Bản. Hãy trò chuyện trực tiếp bằng tiếng Nhật lịch sự công sở N3 (Keigo/Desu/Masu). Luôn trả lời tự nhiên như người thật (2-3 câu), kèm dịch nghĩa tiếng Việt súc tích bên dưới và một câu hỏi dẫn dắt."
          : scenarioId === "casual_friends"
            ? "Bạn là Aoi-chan, bạn thân người Nhật. Hãy trò chuyện như người thật bằng tiếng Nhật thể ngắn (タメ口), dùng thán từ tự nhiên (マジで？, そうなんだ, やばい, めっちゃ). Trả lời ngắn gọn 2-3 câu kèm dịch nghĩa tiếng Việt bên dưới."
            : scenarioId === "travel_restaurant"
              ? "Bạn là nhân viên nhà hàng / hướng dẫn viên du lịch Nhật Bản. Hãy trò chuyện nhã nhặn, tự nhiên như người thật kèm dịch nghĩa tiếng Việt."
              : "Bạn là Aoi Sensei (葵先生), giáo viên tiếng Nhật AI thân thiện tại Nihon Quest. Hãy trò chuyện như một người bản xứ thực thụ, đối thoại tự nhiên bằng tiếng Nhật kèm dịch nghĩa tiếng Việt và khuyến khích học viên.";

      const systemPrompt = `${baseInstruction}\nLƯU Ý QUAN TRỌNG: Hãy đối thoại tự nhiên như người thật đang trò chuyện (khi chào thì chào lại, khi hỏi thì trả lời và hỏi tiếp). KHÔNG trả lời theo khuôn mẫu bài giảng hay cẩm nang giáo trình trừ khi được hỏi trực tiếp về ngữ pháp.`;

      let aiSuccess = false;

      // Rotate through Key Pool
      for (const currentKey of keyList) {
        if (aiSuccess) break;

        // Provider A: GROQ (Keys starting with gsk_) - Free 14,400 req/day, ultra-fast
        if (currentKey.startsWith("gsk_")) {
          try {
            const groqMessages = [
              { role: "system", content: systemPrompt },
              ...history.map((m) => ({
                role: m.role === "assistant" ? "assistant" : "user",
                content: m.content,
              })),
            ];

            const groqModels = ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"];

            for (const gModel of groqModels) {
              if (aiSuccess) break;
              try {
                const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentKey}`,
                  },
                  body: JSON.stringify({
                    model: gModel,
                    messages: groqMessages,
                    temperature: 0.85,
                    max_tokens: 1024,
                  }),
                  signal: AbortSignal.timeout(15000),
                });

                if (groqRes.ok) {
                  const groqData = await groqRes.json();
                  const textResult = groqData?.choices?.[0]?.message?.content;
                  if (textResult && textResult.trim().length > 0) {
                    aiResponse = textResult.trim();
                    aiSuccess = true;
                    await prisma.aiConversation.update({
                      where: { id: conv.id },
                      data: { provider: "GROQ", model: gModel },
                    });
                    break;
                  }
                } else {
                  const errTxt = await groqRes.text();
                  console.warn(`[Groq ${gModel} error ${groqRes.status}]: ${errTxt.slice(0, 140)}`);
                }
              } catch (e: any) {
                console.warn(`[Groq ${gModel} fetch error]: ${e?.message || e}`);
              }
            }
          } catch (e: any) {
            console.warn(`[Groq fetch error]: ${e?.message || e}`);
          }
        }

        // Provider B: OPENROUTER (Keys starting with sk-or-)
        else if (currentKey.startsWith("sk-or-")) {
          try {
            const orMessages = [
              { role: "system", content: systemPrompt },
              ...history.map((m) => ({
                role: m.role === "assistant" ? "assistant" : "user",
                content: m.content,
              })),
            ];

            const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${currentKey}`,
              },
              body: JSON.stringify({
                model: "deepseek/deepseek-chat",
                messages: orMessages,
                temperature: 0.85,
                max_tokens: 1024,
              }),
              signal: AbortSignal.timeout(15000),
            });

            if (orRes.ok) {
              const orData = await orRes.json();
              const textResult = orData?.choices?.[0]?.message?.content;
              if (textResult && textResult.trim().length > 0) {
                aiResponse = textResult.trim();
                aiSuccess = true;
                await prisma.aiConversation.update({
                  where: { id: conv.id },
                  data: { provider: "OPENROUTER", model: "deepseek/deepseek-chat" },
                });
                break;
              }
            }
          } catch (e: any) {
            console.warn(`[OpenRouter fetch error]: ${e?.message || e}`);
          }
        }

        // Provider C: GOOGLE GEMINI (Keys like AIzaSy...)
        else {
          // Build strictly alternating history for Gemini API
          const geminiContents: { role: "user" | "model"; parts: { text: string }[] }[] = [];
          for (const m of history) {
            const role = m.role === "assistant" ? "model" : "user";
            if (geminiContents.length > 0 && geminiContents[geminiContents.length - 1].role === role) {
              geminiContents[geminiContents.length - 1].parts[0].text += `\n${m.content}`;
            } else {
              geminiContents.push({ role, parts: [{ text: m.content }] });
            }
          }

          while (geminiContents.length > 0 && geminiContents[0].role !== "user") {
            geminiContents.shift();
          }

          if (geminiContents.length === 0) {
            geminiContents.push({ role: "user", parts: [{ text: message }] });
          }

          const payload = {
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: geminiContents,
            generationConfig: { temperature: 0.85, maxOutputTokens: 1024 },
          };

          // `model` arrived from the client body and was interpolated straight into the
          // Gemini URL path. Only an explicit allow-list may reach the path.
          const ALLOWED_MODELS = new Set([
            "gemini-3.6-flash",
            "gemini-3.8-flash",
            "gemini-3.6-flash-preview",
            "gemini-3.6-pro",
          ]);
          const requestedModel = typeof (body as { model?: unknown }).model === "string"
            ? (body as { model: string }).model.trim()
            : "";
          const clientModel = ALLOWED_MODELS.has(requestedModel) ? requestedModel : undefined;

          let candidateList = [
            clientModel,
            "gemini-3.6-flash",
            "gemini-3.8-flash",
            "gemini-3.6-flash-preview",
            "gemini-3.6-pro",
          ].filter((m): m is string => Boolean(m && m.length > 0));

          let modelsToTry = Array.from(new Set(candidateList));

          for (const modelName of modelsToTry) {
            if (aiSuccess) break;
            for (let attempt = 0; attempt < 2; attempt++) {
              if (aiSuccess) break;
              try {
                const geminiRes = await fetch(
                  `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${currentKey}`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                    signal: AbortSignal.timeout(18000),
                  }
                );

                if (geminiRes.ok) {
                  const geminiData = await geminiRes.json();
                  const textResult = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (textResult && textResult.trim().length > 0) {
                    aiResponse = textResult.trim();
                    aiSuccess = true;
                    await prisma.aiConversation.update({
                      where: { id: conv.id },
                      data: { provider: "GOOGLE_GEMINI", model: modelName },
                    });
                    break;
                  }
                } else if (geminiRes.status === 503 && attempt === 0) {
                  // Quick backoff for 503 spike
                  await new Promise((r) => setTimeout(r, 900));
                  continue;
                } else {
                  const errText = await geminiRes.text();
                  console.warn(`[Gemini API key ...${currentKey.slice(-4)} ${modelName} HTTP ${geminiRes.status}]: ${errText.slice(0, 140)}`);
                  break;
                }
              } catch (err: any) {
                console.warn(`[Gemini API ${modelName} exception]: ${err?.message || err}`);
                break;
              }
            }
          }

          // If standard models failed with 503/404, discover live active models from Google
          if (!aiSuccess) {
            try {
              const listRes = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models?key=${currentKey}`,
                { signal: AbortSignal.timeout(5000) }
              );
              if (listRes.ok) {
                const listData = await listRes.json();
                const availableModels: string[] = (listData?.models || [])
                  .filter((m: any) => m?.supportedGenerationMethods?.includes("generateContent"))
                  .map((m: any) => m?.name?.replace(/^models\//, ""))
                  .filter((m: string) => !modelsToTry.includes(m));

                for (const discoveredModel of availableModels.slice(0, 3)) {
                  if (aiSuccess) break;
                  const res = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${discoveredModel}:generateContent?key=${currentKey}`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                      signal: AbortSignal.timeout(18000),
                    }
                  );
                  if (res.ok) {
                    const data = await res.json();
                    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text && text.trim().length > 0) {
                      aiResponse = text.trim();
                      aiSuccess = true;
                      await prisma.aiConversation.update({
                        where: { id: conv.id },
                        data: { provider: "GOOGLE_GEMINI", model: discoveredModel },
                      });
                      break;
                    }
                  }
                }
              }
            } catch (e: any) {
              console.warn(`[Model Discovery fallback error]: ${e?.message || e}`);
            }
          }
        }
      }

      if (!aiSuccess) {
        aiResponse = generateNaturalJapaneseResponse({ scenarioId, userMessage: message });
      }
    } catch (err) {
      console.error("[AI Chat Route Error]:", err);
      aiResponse = generateNaturalJapaneseResponse({ scenarioId, userMessage: message });
    }
  } else {
    // Local Natural Conversational Dialogue Engine
    aiResponse = generateNaturalJapaneseResponse({ scenarioId, userMessage: message });
  }

  // Save AI message
  const aiMsg = await prisma.aiMessage.create({
    data: { conversationId: conv.id, role: "assistant", content: aiResponse },
  });

  // Update conversation
  await prisma.aiConversation.update({
    where: { id: conv.id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json({ conversationId: conv.id, message: aiMsg });
}

