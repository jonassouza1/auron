// app/api/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import user from "@/models/user";
import { ValidationError, InternalServerError } from "@/infra/errors";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      throw new ValidationError({
        message: "E-mail e senha são obrigatórios.",
        action: "Envie ambos no corpo da requisição.",
      });
    }

    const userFound = await user.validateUserCredentialsByEmail(
      email,
      password,
    );

    const payload = {
      id: userFound.id,
      username: userFound.username,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60, // 1 hora
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    return handleApiError(error as Error);
  }
}

type Error = {
  statusCode?: number;
};

function handleApiError(error: Error) {
  const internalError = new InternalServerError({
    statusCode: error.statusCode || 500,
    cause: error,
  });

  console.error(internalError);
  return NextResponse.json(
    { message: internalError.message },
    { status: internalError.statusCode },
  );
}
