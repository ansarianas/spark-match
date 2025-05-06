import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { InMemoryEngine } from '@storage/InMemoryEngine';
import { seedProfiles } from '@utils/seeder';
import userRouter from '@routes/users';

export const app: Express = express();
export const engine = new InMemoryEngine();

seedProfiles(100, engine);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(cors());

app.use('/api/user', userRouter);
