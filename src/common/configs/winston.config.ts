import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { DEFAULT_DATE_FORMAT } from '@common/constants/common.constants';
export const winstonConfig: WinstonModuleOptions = {
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({
          all: true,
        }),
        winston.format.label({
          label: '[LOGGER]',
        }),
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf(
          (error) =>
            `[Nest]    - ${[error.timestamp]}  [${error.context}] :  ${
              error.level
            }: ${error.message}`,
        ),
      ),
    }),
    new winston.transports.DailyRotateFile({
      datePattern: DEFAULT_DATE_FORMAT,
      filename: `logs/info-%DATE%.log`,
      level: 'info',
      maxFiles: '6h',
    }),
    new winston.transports.DailyRotateFile({
      filename: `logs/errors-%DATE%.log`,
      datePattern: DEFAULT_DATE_FORMAT,
      level: 'error',
      maxFiles: '2d',
    }),
  ],
  exceptionHandlers: [
    new winston.transports.DailyRotateFile({
      filename: `logs/exceptions-%DATE%.log`,
      datePattern: 'DD.MM.YYYY',
      maxFiles: '2d',
      level: 'exception',
    }),
  ],
  exitOnError: false,
};
