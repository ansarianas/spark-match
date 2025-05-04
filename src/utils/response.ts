import { ValidationError } from 'yup';
import { HttpCodes } from '@constants/http';
import { Validator } from '@models/response';
import { APIError } from './API';

export function failureHandler(error: any) {
  const { code, message } = HttpCodes.INTERNAL_SERVER_ERROR;
  if (error instanceof APIError) {
    const { statusCode, detail, stack, message } = error;
    return {
      statusCode,
      hasError: true,
      detail,
      ...(stack && { stack }),
      ...(message && { message }),
    };
  } else if (error instanceof ValidationError) {
    const { code, message } = HttpCodes.UNPROCESSABLE;
    const validationError: Validator[] = error.inner.map(
      (field: ValidationError) => ({ field: field.path, errors: field.errors }),
    );
    return {
      statusCode: code,
      hasError: true,
      message,
      detail: 'Request body is not valid',
      validationError,
    };
  }

  return {
    statusCode: code,
    hasError: true,
    detail: message,
  };
}

export function successHandler(
  message?: string,
  code: number = HttpCodes.OK.code,
  data?: any,
) {
  return {
    statusCode: code,
    hasError: false,
    ...(message && { message }),
    ...(data && { data }),
  };
}
