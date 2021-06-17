export const BAD_USER_INPUT = "BAD_USER_INPUT";
export const USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS";
export const PASSWORD_NOT_VALID = "PASSWORD_NOT_VALID";

export class ValidationError extends Error {
  constructor(message, code, errors, data) {
    super();
    this.message = message || "validation error";
    this.code = code || BAD_USER_INPUT;
    this.errors = errors;
    this.data = data;
  }
}
