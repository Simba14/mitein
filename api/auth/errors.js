export const BAD_USER_INPUT = 'BAD_USER_INPUT';
export const USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS';
export const PASSWORD_NOT_VALID = 'PASSWORD_NOT_VALID';
export const INVALID_TOKEN = 'INVALID_TOKEN';

export class ValidationError extends Error {
  constructor(message, code, errors, data) {
    super();
    this.message = message || 'validation error';
    this.statusCode = 400;
    this.extensions = {
      ...data,
      code: code || BAD_USER_INPUT,
      errors,
    };
  }
}

export class InvalidTokenError extends Error {
  constructor(message, code, errors) {
    super();
    this.message = message || 'invalid token';
    this.statusCode = 400;
    this.extensions = {
      code: code || INVALID_TOKEN,
      errors,
    };
  }
}
