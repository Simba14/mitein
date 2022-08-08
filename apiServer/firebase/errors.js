export const ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND';
export const EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS';
export const EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED';
export const TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS';
export const WRONG_CREDENTIALS = 'WRONG_CREDENTIALS';
export const INVALID_PASSWORD = 'INVALID_PASSWORD';
export const CHAT_UNAVAILABLE = 'CHAT_UNAVAILABLE';
export const INVALID_CHAT_UPDATE = 'INVALID_CHAT_UPDATE';

export const EMAIL_NOT_FOUND_ERROR_MESSAGE = 'EMAIL_NOT_FOUND';
export const INVALID_PASSWORD_ERROR_MESSAGE = 'INVALID_PASSWORD';
export const TOO_MANY_ATTEMPTS_TRY_LATER_ERROR_MESSAGE =
  'TOO_MANY_ATTEMPTS_TRY_LATER : Too many unsuccessful login attempts. Please try again later.';
export const USER_NOT_FOUND_ERROR_CODE = 'auth/user-not-found';
export const INVALID_PASSWORD_ERROR_CODE = 'auth/invalid-password';
export const WRONG_PASSWORD_ERROR_CODE = 'auth/wrong-password';
export const EMAIL_EXISTS_CODE = 'auth/email-already-in-use';
export const UNABLE_TO_PARSE_ERROR_CODE = 'app/unable-to-parse-response'; // error when using emulator

// error messages must align with keys in locales/errors.json
const ACCOUNT_NOT_FOUND_MESSAGE = 'accountNotFound';
export const CHAT_UNAVAILABLE_MESSAGE = 'chatUnavailable';
export const CHAT_CANCELLED_MESSAGE = 'chatCancelled';
export const GENERIC_ERROR_MESSAGE = 'genericError';
const WRONG_CREDENTIALS_MESSAGE = 'wrongCredentials';
const EMAIL_ALREADY_EXISTS_MESSAGE = 'emailAlreadyExists';
const EMAIL_NOT_VERIFIED_MESSAGE = 'emailNotVerified';
const TOO_MANY_ATTEMPTS_MESSAGE = 'tooManyAttempts';

export class FirebaseCreateDocError extends Error {
  constructor(message, code, errors) {
    super();
    this.message = message || 'Document creation failed';
    this.extensions = {
      code: code,
      errors,
    };
  }
}
export class FirebaseUpdateDocError extends Error {
  constructor(message, code, errors) {
    super();
    this.message = message || 'Document update failed';
    this.extensions = {
      code: code,
      errors,
    };
  }
}

export class FirebaseGetDocError extends Error {
  constructor(message, code, errors) {
    super();
    this.message = message || 'Document could not be retrieved';
    this.extensions = {
      code: code,
      errors,
    };
  }
}
export class FirebaseAccountNotFoundError extends Error {
  constructor(message, code, errors) {
    super();
    this.message = message || ACCOUNT_NOT_FOUND_MESSAGE;
    this.extensions = {
      code: code || ACCOUNT_NOT_FOUND,
      errors,
    };
  }
}

export class FirebaseWrongCredentialsError extends Error {
  constructor(message, code, errors) {
    super();
    this.message = WRONG_CREDENTIALS_MESSAGE;
    this.extensions = {
      code: code || WRONG_CREDENTIALS,
      errors,
    };
  }
}

export class FirebaseEmailAlreadyExistsError extends Error {
  constructor(message, code, errors) {
    super();
    this.message = EMAIL_ALREADY_EXISTS_MESSAGE;
    this.extensions = {
      code: code || EMAIL_ALREADY_EXISTS,
      errors,
    };
  }
}

export class FirebaseEmailNotVerifiedError extends Error {
  constructor(message, code, errors) {
    super();
    this.message = message || EMAIL_NOT_VERIFIED_MESSAGE;
    this.extensions = {
      code: code || EMAIL_NOT_VERIFIED,
      errors,
    };
  }
}

export class FirebaseEmailTooManyAttemptsError extends Error {
  constructor(message, code, errors) {
    super();
    this.message = message || TOO_MANY_ATTEMPTS_MESSAGE;
    this.extensions = {
      code: code || TOO_MANY_ATTEMPTS,
      errors,
    };
  }
}

export class FirebaseInvalidPasswordError extends Error {
  constructor(message, code, errors) {
    super();
    this.message = message;
    this.extensions = {
      code: code || INVALID_PASSWORD,
      errors,
    };
  }
}

export class FirebaseUpdateChatError extends Error {
  constructor(message, code, errors) {
    super();
    this.message = message;
    this.extensions = {
      code: code || INVALID_CHAT_UPDATE,
      errors,
    };
  }
}
