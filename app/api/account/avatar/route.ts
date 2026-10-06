import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

const MAX_LEN = 300_000; // ~220 KB; ảnh 256×256 JPEG thường chỉ 20–40 KB

async function currentUser() {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!id) return null;
  return prisma.user.findUnique({ where: { id }, include: { profile: true } });
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { avatar } = await req.json().catch(() => ({}));
  if (typeof avatar !== "string" || !/^data:image\/(jpeg|png|webp);base64,/.test(avatar) || avatar.length > MAX_LEN) {
    return NextResponse.json({ error: "Ảnh không hợp lệ" }, { status: 400 });
  }

  const displayName = user.profile?.displayName ?? user.name ?? user.email.split("@")[0];
  await prisma.user.update({
    where: { id: user.id },
    data: { profile: { upsert: { create: { displayName, avatar: avatar }, update: { avatar: avatar } } } },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.profile) await prisma.profile.update({ where: { userId: user.id }, data: { avatar: null } });
  return NextResponse.json({ ok: true });
}