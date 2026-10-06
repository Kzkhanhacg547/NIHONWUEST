import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text")?.trim();

  if (!text) {
    return new NextResponse("Text query param is required", { status: 400 });
  }

  // Strip romaji / parentheses notes so Japanese speech is clean
  const cleanText = text
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[\(\[\{（【].*?[\)\]\}）】]/g, "")
    .trim()
    .slice(0, 300);

  if (!cleanText) {
    return new NextResponse("Empty text after cleaning", { status: 400 });
  }

  try {
    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=ja&client=tw-ob`;
    const response = await fetch(googleTtsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return new NextResponse("Failed to fetch audio from TTS engine", { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch {
    return new NextResponse("Internal server error during TTS synthesis", { status: 500 });
  }
}
