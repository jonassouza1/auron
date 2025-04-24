type ErrorParams = {
  cause: unknown;
  message?: string;
  action?: string;
  statusCode?: number;
};

export class InternalServerError extends Error {
  public action: string;
  public statusCode: number;
  constructor({ cause, statusCode }: ErrorParams) {
    super("Um erro interno não esperado aconteceu.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Entre em contato com suporte.";
    this.statusCode = statusCode || 500;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
export class ServiceError extends Error {
  public action: string;
  public statusCode: number;
  constructor({ cause, message }: ErrorParams) {
    super(message || "Serviço indisponivel no momento.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Verifique se o serviço está disponível.";
    this.statusCode = 503;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
export class ValidationError extends Error {
  public action: string;
  public statusCode: number;
  constructor({ cause, message, action }: ErrorParams) {
    super(message || "Um erro de validação ocorreu.", {
      cause,
    });
    this.name = "ValidationError";
    this.action = action || "ajuste os dados enviados e tente novamente.";
    this.statusCode = 400;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
export class NotFoundError extends Error {
  public action: string;
  public statusCode: number;
  constructor({ cause, message, action }: ErrorParams) {
    super(message || "Não foi possível encontrar este recurso no sistema.", {
      cause,
    });
    this.name = "NotFoundError";
    this.action =
      action || "Verifique se os parâmetros na consulta estão certos.";
    this.statusCode = 404;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  public action: string;
  public statusCode: number;
  constructor() {
    super("Método não permitido para este endpoint.");
    this.name = "MethodNotAllowedError";
    this.action = "Verifique se o método http é válido para este endpoint.";
    this.statusCode = 405;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
