import { NextResponse, NextRequest } from "next/server";
import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
  NotFoundError,
} from "@/infra/errors";
import user from "@/models/user";

export async function GET(request: NextRequest) {
  try {
    const urlParts = request.nextUrl.pathname.split("/");
    const userName = urlParts[urlParts.length - 1];

    const userFound = await user.findOneByUsername(userName);
    return NextResponse.json(userFound);
  } catch (error) {
    return handleApiError(error as Error);
  }
}

interface UserData {
  id: string | number;
  username: string;
  email: string;
  password: string;
  points: number;
}

export async function PATCH(request: NextRequest) {
  try {
    const urlParts = request.nextUrl.pathname.split("/");
    const userName = urlParts[urlParts.length - 1];

    let userInputValues: UserData = {
      id: "",
      username: "",
      email: "",
      password: "",
      points: 0,
    };
    if (request.headers.get("content-length") !== "0") {
      userInputValues = await request.json();
    }

    const updatedUser = await user.update(userName, userInputValues);

    return NextResponse.json(updatedUser);
  } catch (error) {
    return handleApiError(error as Error);
  }
}

// Handle métodos não permitidos
export function DELETE() {
  const error = new MethodNotAllowedError();
  return NextResponse.json(error, { status: error.statusCode });
}
type Error = {
  statusCode: number;
};
function handleApiError(error: Error) {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    return NextResponse.json(error, { status: error.statusCode });
  }

  const internalError = new InternalServerError({
    statusCode: error?.statusCode,
    cause: error,
  });

  console.error(internalError);
  return NextResponse.json(internalError, { status: internalError.statusCode });
}
