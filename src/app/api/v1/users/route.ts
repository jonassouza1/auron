import { NextRequest, NextResponse } from "next/server";
import {
  InternalServerError,
  ValidationError,
  NotFoundError,
} from "@/infra/errors";
import user from "@/models/user";

export async function POST(request: NextRequest) {
  try {
    const userInputValues = await request.json();

    const newUser = await user.create(userInputValues);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return handleApiError(error as Error);
  }
}
type Error = {
  statusCode: number;
};

function handleApiError(error: Error) {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    return NextResponse.json(error, { status: error.statusCode });
  }

  const internalError = new InternalServerError({
    statusCode: error.statusCode || 500,
    cause: error,
  });

  console.error(internalError);
  return NextResponse.json(internalError, { status: internalError.statusCode });
}
