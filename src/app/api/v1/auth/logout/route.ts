import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Deslogado com sucesso" });
  res.cookies.set("token", "", {
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res;
}
