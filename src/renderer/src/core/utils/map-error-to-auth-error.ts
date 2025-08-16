import type { AuthError } from "../context/auth-context/auth-context.types";

// Error mapping helper
export const mapErrorToAuthError = (error: unknown): AuthError => {
  if (error instanceof Error) {
    switch (error.name) {
      case "UsernameExistsException":
        return {
          type: "USER_ALREADY_EXISTS",
          message: "Este número de teléfono ya está registrado",
          code: error.name,
        };
      case "UserNotFoundException":
        return {
          type: "USER_NOT_FOUND",
          message: "Usuario no encontrado",
          code: error.name,
        };
      case "CodeMismatchException":
        return {
          type: "INVALID_CODE",
          message: "Código de verificación incorrecto",
          code: error.name,
        };
      case "ExpiredCodeException":
        return {
          type: "CODE_EXPIRED",
          message: "El código de verificación ha expirado",
          code: error.name,
        };
      case "NetworkError":
        return {
          type: "NETWORK_ERROR",
          message: "Error de conexión. Verifica tu internet",
          code: error.name,
        };
      default:
        return {
          type: "UNKNOWN_ERROR",
          message: error.message || "Ha ocurrido un error inesperado",
          code: error.name,
        };
    }
  }

  return {
    type: "UNKNOWN_ERROR",
    message: "Ha ocurrido un error inesperado",
  };
};
