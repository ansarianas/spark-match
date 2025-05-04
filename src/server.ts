import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';

export const app: Express = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(cors());
