import { Request, Response } from 'express';
import { failureHandler } from './response';

/**
 * @param fn Handler function
 * @description Wrapper for handlers to handle error globally
 */
export const asyncHandler =
  (fn: Function, context: any) => (req: Request, res: Response) => {
    Promise.resolve(fn(req, res)).catch(async (err) => {
      const response = failureHandler(err);
      const error = {
        ...context,
        createdAt: new Date().toISOString(),
        stackTrace: err.stack,
        statusCode: response.statusCode.toString(),
        message: err.detail,
      };

      console.error(error);
      return res.status(response.statusCode).send(response);
    });
  };
