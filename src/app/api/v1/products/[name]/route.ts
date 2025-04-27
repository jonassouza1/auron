import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import database from "@/infra/database";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/");
  const name = segments[segments.length - 1];

  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { message: "Nome do produto não fornecido ou inválido." },
      { status: 400 },
    );
  }

  const trimmedName = name.trim();

  try {
    const productsResult = await database.query({
      text: `
        SELECT p.*, s.name AS size_name, c.name AS category_name
        FROM products p
        LEFT JOIN sizes s ON p.size_id = s.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE LOWER(TRIM(p.name)) = LOWER($1);
      `,
      values: [trimmedName],
    });

    if (productsResult.rows.length === 0) {
      return NextResponse.json(
        { message: "Produto não encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      products: productsResult.rows,
    });
  } catch (err) {
    console.error("Erro ao buscar produto:", err);
    return NextResponse.json(
      { message: "Erro ao buscar produto." },
      { status: 500 },
    );
  }
}
