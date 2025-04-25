import type { NextApiRequest, NextApiResponse } from "next";
import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
  NotFoundError,
} from "@/infra/errors";

interface CustomError extends Error {
  statusCode: number;
  action: string;
  cause?: unknown;
}
async function onNoMatchHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

async function onErrorHandler(
  err: unknown,
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const error = err as CustomError;

  if (error instanceof ValidationError || error instanceof NotFoundError) {
    return res.status(error.statusCode).json(error);
  }

  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode || 500,
    cause: error,
  });

  console.error(publicErrorObject);
  res.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
