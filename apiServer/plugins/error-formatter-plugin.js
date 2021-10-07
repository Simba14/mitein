import { get } from 'lodash/fp';
import { log } from '@api/logger';
import {
  ACCOUNT_NOT_FOUND,
  WRONG_CREDENTIALS,
  EMAIL_NOT_VERIFIED,
  TOO_MANY_ATTEMPTS,
  EMAIL_NOT_FOUND_ERROR_MESSAGE,
  INVALID_PASSWORD_ERROR_MESSAGE,
  TOO_MANY_ATTEMPTS_TRY_LATER_ERROR_MESSAGE,
  USER_NOT_FOUND_ERROR_CODE,
  INVALID_PASSWORD_ERROR_CODE,
} from '@api/firebase/errors';
import { MEMBER_EXISTS_CODE } from '@api/notifications/errors';
import {
  BAD_USER_INPUT,
  USER_ALREADY_EXISTS,
  PASSWORD_NOT_VALID,
} from '@api/auth/errors';

const notLoggeableErrors = [
  ACCOUNT_NOT_FOUND,
  BAD_USER_INPUT,
  EMAIL_NOT_FOUND_ERROR_MESSAGE,
  EMAIL_NOT_VERIFIED,
  INVALID_PASSWORD_ERROR_CODE,
  INVALID_PASSWORD_ERROR_MESSAGE,
  MEMBER_EXISTS_CODE,
  PASSWORD_NOT_VALID,
  TOO_MANY_ATTEMPTS_TRY_LATER_ERROR_MESSAGE,
  TOO_MANY_ATTEMPTS,
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND_ERROR_CODE,
  WRONG_CREDENTIALS,
];

const sensitiveVariablesRegex = /pass|email/i;

const isSensitiveKey = variable => {
  return variable.match(sensitiveVariablesRegex);
};

const maskSensitiveData = variables => {
  if (variables && typeof variables === 'object') {
    for (const [key, value] of Object.entries(variables)) {
      if (isSensitiveKey(key)) {
        // eslint-disable-next-line no-param-reassign
        variables[key] = '**********';
      }

      if (typeof value === 'object') {
        maskSensitiveData(value);
      }
    }
  }

  return variables;
};

const isLoggeable = error => {
  if (notLoggeableErrors.includes(get('extensions.code', error))) {
    return false;
  }

  return true;
};

const logError = error => {
  if (isLoggeable(error)) {
    log('', 'error', error);
  } else {
    log('', 'debug', error);
  }
};

const ErrorFormatterPlugin = () => ({
  requestDidStart() {
    return {
      willSendResponse(requestContext) {
        const { context, response } = requestContext;

        if (response.errors) {
          const graphqlQuery = get('req.body.query', context);
          const graphqlVariables = get('req.body.variables', context);

          const metadata = {
            ...(graphqlQuery && { graphqlQuery }),
            ...(graphqlVariables && {
              graphqlVariables: maskSensitiveData(graphqlVariables),
            }),
          };

          response.errors
            .map(error => ({ ...error, metadata }))
            .forEach(logError);
        }

        return response;
      },
    };
  },
});

export default ErrorFormatterPlugin;
