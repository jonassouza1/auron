import database from "@/infra/database";
import {
  InternalServerError,
  ValidationError,
  NotFoundError,
} from "@/infra/errors";

export async function GET() {
  try {
    const updatedAt = new Date().toISOString();

    const databaseVersionResult = await database.query({
      text: "SHOW server_version;",
    });

    const databaseMaxConnectionsResult = await database.query({
      text: "SHOW max_connections;",
    });

    const databaseName = process.env.POSTGRES_DB;

    const databaseOpenedConnectionsResult = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    });

    const databaseOpenedConnectionsValue =
      databaseOpenedConnectionsResult.rows[0].count;
    const databaseMaxConnectionsValue =
      databaseMaxConnectionsResult.rows[0].max_connections;
    const databaseVersionValue = databaseVersionResult.rows[0].server_version;

    return Response.json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: databaseVersionValue,
          max_connections: parseInt(databaseMaxConnectionsValue),
          opened_connections: databaseOpenedConnectionsValue,
        },
      },
    });
  } catch (err) {
    const maybeError = err as { statusCode?: number };
    const error =
      err instanceof ValidationError || err instanceof NotFoundError
        ? err
        : new InternalServerError({
            statusCode: maybeError.statusCode ?? 500,
            cause: err,
          });

    console.error(error);

    return new Response(JSON.stringify(error), {
      status: error.statusCode || 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
