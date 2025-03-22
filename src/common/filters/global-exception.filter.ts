import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AxiosError } from 'axios';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const type = host.getType();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorDetails = this.extractErrorDetails(exception);

    if (type === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();

      this.logger.error(
        `Exception caught in ${request.url || 'Unknown'}`,
        JSON.stringify({
          timestamp: new Date().toISOString(),
          method: request.method,
          url: request.url,
          ...errorDetails,
        }),
      );

      response.status(status).json({
        statusCode: status,
        error: errorDetails.message || 'Internal server error',
      });
    } else {
      this.logger.error(
        `Unhandled exception in ${type}`,
        JSON.stringify(errorDetails),
      );
    }
  }

  private extractErrorDetails(exception: unknown) {
    if (exception instanceof HttpException) {
      const response = exception.getResponse() as
        | string
        | { message?: string; [key: string]: any };

      const message =
        typeof response === 'string'
          ? response
          : response?.message || 'An error occurred';

      return {
        message,
        stack: exception.stack || null,
      };
    } else if (exception instanceof AxiosError) {
      return {
        message:
          exception.response?.data?.message ||
          exception.message ||
          'An Axios error occurred',
        stack: exception.stack || null,
      };
    } else if (exception instanceof Error) {
      return {
        message: exception.message || 'An error occurred',
        stack: exception.stack || null,
      };
    } else {
      return {
        message: 'Unknown error',
        details: JSON.stringify(exception, null, 2),
      };
    }
  }
}
