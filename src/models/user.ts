import database from "@/infra/database";
import password from "@/models/password";
import { ValidationError, NotFoundError } from "@/infra/errors";

async function findOneByUsername(username: string) {
  const userFound = await runSelectQuery(username);
  return userFound;
  async function runSelectQuery(username: string) {
    const results = await database.query({
      text: "SELECT * FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1;",
      values: [username],
    });
    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
      });
    }
    return results.rows[0];
  }
}

async function create(userInputValues: UserData) {
  await validateUniqueUsername(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);
  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function runInsertQuery(userInputValues: UserData) {
    const results = await database.query({
      text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;",
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    return results.rows[0];
  }
}

interface UserData {
  id: string | number;
  username: string;
  email: string;
  password: string;
  points: number;
}
async function update(username: string, userInputValues: UserData) {
  const currentUser = await findOneByUsername(username);

  if ("username" in userInputValues) {
    await validateUniqueUsername(userInputValues.username);
  }

  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };
  const updatedUser = await runUpdatedQuery(userWithNewValues);
  return updatedUser;
  async function runUpdatedQuery(userWithNewValues: UserData) {
    const results = await database.query({
      text: `
      UPDATE
         users
      SET
         username = $2,
         email = $3,
         password = $4,
         points = $5,
         updated_at = timezone('utc', now())
      WHERE 
         id= $1
      RETURNING
         *
         `,
      values: [
        userWithNewValues.id,
        userWithNewValues.username,
        userWithNewValues.email,
        userWithNewValues.password,
        userWithNewValues.points,
      ],
    });
    return results.rows[0];
  }
}

async function validateUserCredentialsByEmail(
  email: string,
  plainPassword: string,
) {
  const userFound = await findOneByEmail(email);

  const isPasswordValid = await password.compare(
    plainPassword,
    userFound.password,
  );
  if (!isPasswordValid) {
    throw new ValidationError({
      message: "Credenciais inválidas. Verifique o email e a senha.",
      action: "Tente novamente com credenciais válidas.",
    });
  }

  return userFound;
}

async function incrementUserPoints(
  userId: string | number,
  pointsToAdd: number,
) {
  const result = await database.query({
    text: `
      UPDATE users
      SET points = points + $1,
          updated_at = timezone('utc', now())
      WHERE id = $2
      RETURNING *;
    `,
    values: [pointsToAdd, userId],
  });

  if (result.rowCount === 0) {
    throw new NotFoundError({
      message: "Usuário não encontrado para adicionar pontos.",
      action: "Verifique o ID do usuário.",
    });
  }

  return result.rows[0];
}

async function findOneByEmail(email: string) {
  const userFound = await runSelectQuery(email);
  return userFound;

  async function runSelectQuery(email: string) {
    const results = await database.query({
      text: "SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1;",
      values: [email],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O email informado não foi encontrado no sistema.",
        action: "Verifique se o email está digitado corretamente.",
      });
    }

    return results.rows[0];
  }
}

async function validateUniqueUsername(username: string) {
  const results = await database.query({
    text: "SELECT username FROM users WHERE LOWER(username) = LOWER($1);",
    values: [username],
  });
  if (results.rowCount !== 0) {
    throw new ValidationError({
      message: "O username informado já está sendo utilizado.",
      action: "Utilize outro username para realizar esta operação.",
    });
  }
}
async function validateUniqueEmail(email: string) {
  const results = await database.query({
    text: "SELECT email FROM users WHERE LOWER(email) = LOWER($1);",
    values: [email],
  });
  if (results.rowCount !== 0) {
    throw new ValidationError({
      message: "O email informado já está sendo utilizado.",
      action: "Utilize outro email para realizar esta operação.",
    });
  }
}

async function hashPasswordInObject(userInputValues: UserData) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

const user = {
  create,
  findOneByUsername,
  update,
  validateUserCredentialsByEmail,
  incrementUserPoints,
};
export default user;
