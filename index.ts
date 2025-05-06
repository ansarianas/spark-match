// Resolving config issue raised after configuring absolute paths
require('module-alias/register');
const moduleAlias = require('module-alias');

moduleAlias.addAliases({
  '@constants': __dirname + '/src/constants',
  '@db': __dirname + '/src/db',
  '@handlers': __dirname + '/src/handlers',
  '@middlewares': __dirname + '/src/middlewares',
  '@storage': __dirname + '/src/storage',
  '@models': __dirname + '/src/models',
  '@routes': __dirname + '/src/routes',
  '@validations': __dirname + '/src/validations',
  '@utils': __dirname + '/src/utils',
});

import { app } from './src/server';
import config from './src/utils/config';

const { REST_HOST: HOST, REST_PORT: PORT }: any = config;

app.listen(PORT, HOST, async () => {
  console.log(`Listening on port ${HOST}:${PORT}`);
});
