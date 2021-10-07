import { createLogger, format, transports } from 'winston';
import config from '@api/config';

const DEFAULT_LEVEL = 'info';

export const logger = createLogger({
  format: config.isProduction
    ? format.json()
    : format.combine(format.colorize(), format.simple()),
  level: config.winston.winstonLevel || DEFAULT_LEVEL,
  exitOnError: false,
  transports: [new transports.Console()],
});

export const log = (
  msg = 'No logging message',
  level = DEFAULT_LEVEL,
  meta = {},
) => {
  return logger.log(level, msg, meta);
};
