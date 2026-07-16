import { AppConfig } from '../config';

// The only place that reads AppConfig.enableLogs — callers never branch on env themselves.
export const logger = {
  log: (...args: unknown[]) => {
    if (AppConfig.enableLogs) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (AppConfig.enableLogs) console.warn(...args);
  },
  error: (...args: unknown[]) => console.error(...args),
};
