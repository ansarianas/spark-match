import { HttpCodes } from '@constants/http';

export class APIError extends Error {
  statusCode: number;
  detail: string;

  constructor(statusCode: number, message: string, detail: string) {
    super(message);
    this.statusCode = statusCode;
    this.detail = detail;
  }
}

export class BadRequestError extends APIError {
  constructor(detail: string) {
    super(HttpCodes.BAD_REQUEST.code, HttpCodes.BAD_REQUEST.message, detail);
  }
}

export class NotFoundError extends APIError {
  constructor(detail: string) {
    super(HttpCodes.NOT_FOUND.code, HttpCodes.NOT_FOUND.message, detail);
  }
}

export class InternalServerError extends APIError {
  constructor(detail: string) {
    super(
      HttpCodes.INTERNAL_SERVER_ERROR.code,
      HttpCodes.INTERNAL_SERVER_ERROR.message,
      detail,
    );
  }
}
