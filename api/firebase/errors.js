export const ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND';
export const WRONG_CREDENTIALS = 'WRONG_CREDENTIALS';
export const EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED';
export const TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS';

export const EMAIL_NOT_FOUND_ERROR_MESSAGE = 'EMAIL_NOT_FOUND';
export const INVALID_PASSWORD_ERROR_MESSAGE = 'INVALID_PASSWORD';
export const TOO_MANY_ATTEMPTS_TRY_LATER_ERROR_MESSAGE =
  'TOO_MANY_ATTEMPTS_TRY_LATER : Too many unsuccessful login attempts. Please try again later.';
export const USER_NOT_FOUND_ERROR_CODE = 'auth/user-not-found';
export const INVALID_PASSWORD_ERROR_CODE = 'auth/wrong-password';

export class FirebaseAccountNotFoundError extends Error {
  constructor(message, code, errors) {
    super();
    this.message = message || 'account not found';
    this.code = code || ACCOUNT_NOT_FOUND;
    this.errors = errors;
  }
}

export class FirebaseWrongCredentialsError extends Error {
  constructor(message, code, errors) {
    super();
    this.message = 'Incorrect credentials provided';
    this.code = code || WRONG_CREDENTIALS;
    this.errors = errors;
  }
}

export class FirebaseEmailNotVerifiedError extends Error {
  constructor(message, code, errors) {
    super();
    this.message = message || 'the email is not verified';
    this.code = code || WRONG_CREDENTIALS;
    this.errors = errors;
  }
}

export class FirebaseEmailTooManyAttemptsError extends Error {
  constructor(message, code, errors) {
    super();
    this.message = message || 'Too many unsuccessful attempts';
    this.code = code || TOO_MANY_ATTEMPTS;
    this.errors = errors;
  }
}
