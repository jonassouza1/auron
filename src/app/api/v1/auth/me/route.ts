import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import user from "@/models/user";
import { NotFoundError, ValidationError } from "@/infra/errors";

export async function GET() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return Response.json({ error: "Token ausente" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!),
    );

    const username = payload.username;
    if (!username) {
      throw new ValidationError({
        message: "Payload JWT inválido.",
        action: "Faça login novamente.",
      });
    }

    const userFound = await user.findOneByUsername(username as string);
    if (!userFound) {
      throw new NotFoundError({
        message: "Usuário não encontrado.",
        action: "Verifique se o token é válido.",
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = userFound;

    return Response.json(safeUser);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Token inválido ou expirado" },
      { status: 401 },
    );
  }
}
