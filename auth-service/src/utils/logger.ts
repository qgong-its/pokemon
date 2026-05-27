import fs from 'node:fs';
import path from 'node:path';

const logDir = process.env.LOG_DIR
  ? path.resolve(process.env.LOG_DIR)
  : path.join(process.cwd(), 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, {
    recursive: true,
  });
}

const getLogFilePath = (level: LogLevel) => {
  const timestamp = new Date().toISOString();

  return path.join(
    logDir,
    `${level.toLowerCase()}-${timestamp.split('T')[0]}.log`,
  );
};

export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export const writeLog = (level: LogLevel, message: string) => {
  const timestamp = new Date().toISOString();

  const logMessage = `[${timestamp}] [${level}] ${message}\n`;

  console.log(logMessage);

  fs.appendFileSync(getLogFilePath(level), logMessage, 'utf-8');
};
