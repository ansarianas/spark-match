import dotenv from 'dotenv';

dotenv.config();

const { env } = process;

const config = {
  REST_PORT: env.REST_PORT || 9000,
  REST_HOST: env.REST_HOST || '127.0.0.1',
};

export default config;
