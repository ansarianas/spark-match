import { NextFunction, Request, Response } from 'express';
import { AnySchema } from 'yup';
import { failureHandler } from '@utils/response';

export const validator =
  <T extends AnySchema>(schema: T) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.validate(req.body, { abortEarly: false });
      return next();
    } catch (err) {
      const response = failureHandler(err);
      res.status(response.statusCode).send(response);
    }
  };
