// src/app/api/products/route.ts

import { NextResponse } from "next/server";
import database from "@/infra/database"; // ajusta o path conforme onde está seu arquivo

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category_name = searchParams.get("category_name");

  try {
    let queryText = `
      SELECT 
        products.*, 
        categories.name as category_name,
        sizes.name as size_name
      FROM products
      LEFT JOIN categories ON products.category_id = categories.id
      LEFT JOIN sizes ON products.size_id = sizes.id
    `;

    const queryParams: unknown[] = [];

    if (category_name) {
      queryText += ` WHERE LOWER(categories.name) = LOWER($1)`;
      queryParams.push(category_name);
    }

    const productsResult = await database.query({
      text: queryText,
      values: queryParams,
    });

    return NextResponse.json({
      products: productsResult.rows,
    });
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    return NextResponse.json(
      { message: "Erro ao buscar produtos." },
      { status: 500 },
    );
  }
}
