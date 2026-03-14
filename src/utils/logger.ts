import winston from 'winston';

/**
 * Create a logger instance.
 *
 * @param debug - whether to enable debug logging
 */
export function createLogger(debug: boolean): void {
  global.debug = debug;

  const { combine, timestamp, printf } = winston.format;

  global.logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    level: debug ? 'debug' : 'info',
    format: combine(
      timestamp(),
      printf(({ level, message, timestamp }) => {
        return debug ? `${timestamp} [${level.toUpperCase()}]: ${message}` : `${message}`;
      })
    ),
    defaultMeta: { service: 'user-service' },
    transports: [new winston.transports.Console({ level: debug ? 'debug' : 'info' })]
  });
}

export function currentDateTime(): string {
  return new Date().toLocaleString();
}
