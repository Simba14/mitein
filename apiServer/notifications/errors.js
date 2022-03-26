export const MEMBER_EXISTS_CODE = 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS';
const MEMBER_EXISTS_MESSAGE = 'This email is already subscribed';

export class NewsletterEmailAlreadySubscribedError extends Error {
  constructor(message, code, errors) {
    super();
    this.message = message || MEMBER_EXISTS_MESSAGE;
    this.extensions = {
      code: code || MEMBER_EXISTS_CODE,
      errors,
    };
  }
}
