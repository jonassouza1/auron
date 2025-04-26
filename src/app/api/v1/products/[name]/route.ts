// src/app/api/products/[name]/route.ts

import { NextResponse } from "next/server";
import database from "@/infra/database"; // ajusta conforme o seu projeto

interface Params {
  params: {
    name: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  let { name } = params;

  if (!name) {
    return NextResponse.json(
      { message: "Nome do produto não fornecido." },
      { status: 400 },
    );
  }

  name = name.trim();

  try {
    const productsResult = await database.query({
      text: `
        SELECT p.*, s.name AS size_name, c.name AS category_name
        FROM products p
        LEFT JOIN sizes s ON p.size_id = s.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE LOWER(TRIM(p.name)) = LOWER($1);
      `,
      values: [name],
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
