import _ from "lodash/fp";
import { createLogger, format, transports } from "winston";
import config from "./config.js";

const DEFAULT_LEVEL = "info";
const ERROR_LEVEL = "error";

export const logger = createLogger({
  format: config.isProduction
    ? format.json()
    : format.combine(format.colorize(), format.simple()),
  level: config.winston.winston_level || DEFAULT_LEVEL,
  exitOnError: false,
  transports: [new transports.Console()]
});

export const log = (
  msgOrError = "No logging message",
  level = DEFAULT_LEVEL,
  meta = {}
) => {
  let metaData = meta;
  let msg = msgOrError;

  if (_.isError(msgOrError)) {
    metaData = {
      stack: msgOrError.stack,
      errorCode: msgOrError.code,
      errorObject: msgOrError,
      ...metaData
    };

    msg = msgOrError.message;
  } else if (level === ERROR_LEVEL) {
    msg = JSON.stringify(msgOrError);
  }

  return logger.log(level, msg, metaData);
};
