import migrator from "@/models/migrator";
import { NextResponse } from "next/server";
import {
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "@/infra/errors";

export async function GET() {
  try {
    const pendingMigrations = await migrator.listPendingMigrations();
    return NextResponse.json(pendingMigrations, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST() {
  try {
    const migratedMigrations = await migrator.runPendingMigrations();
    const status = migratedMigrations.length > 0 ? 201 : 200;
    return NextResponse.json(migratedMigrations, { status });
  } catch (err) {
    return handleError(err);
  }
}

function handleError(err: unknown) {
  const error = err as { statusCode?: number; message?: string };

  if (err instanceof ValidationError || err instanceof NotFoundError) {
    return NextResponse.json(
      { name: err.name, message: err.message },
      { status: err.statusCode },
    );
  }

  const publicError = new InternalServerError({
    statusCode: error?.statusCode || 500,
    cause: err,
  });

  console.error(publicError);

  return NextResponse.json(
    {
      name: publicError.name,
      message: publicError.message,
    },
    { status: publicError.statusCode },
  );
}
