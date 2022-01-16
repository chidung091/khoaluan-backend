import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import { Response } from 'express'
import { debugLog, errorLog } from 'src/common/logger'
import { isClientErrorStatus } from 'src/common/utils'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = error.getStatus()
    const errorResponse = error.getResponse()
    const logger = isClientErrorStatus(status) ? debugLog : errorLog
    logger(errorResponse)

    response.status(status).json(
      typeof errorResponse === 'string'
        ? {
            name: 'Error',
            status,
            message: errorResponse,
          }
        : errorResponse,
    )
  }
}
