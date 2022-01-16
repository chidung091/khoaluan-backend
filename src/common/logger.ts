import { PinoLogger } from 'nestjs-pino'

export const logEnabled = Boolean('true')

export enum LogLevel {
  Emerg = 'emerg',
  Alert = 'alert',
  Crit = 'crit',
  Error = 'error',
  Warning = 'warning',
  Notice = 'notice',
  Info = 'info',
  Debug = 'debug',
}

export const logLevel = 'info'

export const logger = new PinoLogger({
  pinoHttp: {
    level: logLevel,
    formatters: {
      level: (label) => {
        return { level: label }
      },
    },
    transport: {
      target: 'pino-pretty',
    },
  },
})

export function errorLog(
  data?: any,
  customMessage?: string,
  userId?: string,
): void {
  log(LogLevel.Error, data, customMessage, userId)
}

export function debugLog(
  data?: any,
  customMessage?: string,
  userId?: string,
): void {
  log(LogLevel.Debug, data, customMessage, userId)
}

export function infoLog(
  data?: any,
  customMessage?: string,
  userId?: string,
): void {
  log(LogLevel.Info, data, customMessage, userId)
}

export function critLog(
  data?: any,
  customMessage?: string,
  userId?: string,
): void {
  log(LogLevel.Crit, data, customMessage, userId)
}

export function apiLog(req?: any, res?: any) {
  const data: any = {}
  if (req) {
    data.request = { ...req }
  }

  if (res) {
    data.response = { ...res }
    delete data.response.obj
    delete data.response.data
    delete data.response.text
  }

  debugLog(data)
}

function log(
  logLevel: LogLevel,
  data?: any,
  customMessage = 'LOG',
  userId?: string,
): void {
  if (logEnabled) {
    try {
      switch (logLevel) {
        case LogLevel.Debug:
          logger.debug(data, customMessage, userId)
          break
        case LogLevel.Error:
          logger.error(data, customMessage, userId)
          break
        case LogLevel.Info:
          logger.info(data, customMessage, userId)
          break
        case LogLevel.Alert:
        case LogLevel.Notice:
        case LogLevel.Warning:
          logger.warn(data, customMessage, userId)
          break
        case LogLevel.Emerg:
        case LogLevel.Crit:
          logger.fatal(data, customMessage, userId)
          break
      }
    } catch (err) {
      errorLog(err, 'Error in log function in logger')
    }
  }
}
