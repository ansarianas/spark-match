export enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export const HttpCodes = {
  OK: {
    code: 200,
    message: 'Success',
  },
  CREATED: {
    code: 201,
    message: 'Resource Created Successfully',
  },
  BAD_REQUEST: {
    code: 400,
    message: 'Bad request',
  },
  NOT_FOUND: {
    code: 404,
    message: 'Not found',
  },
  UNPROCESSABLE: {
    code: 422,
    message: 'Unprocessable Entity',
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: 'Internal server error',
  },
};
