const Hapi = require('@hapi/hapi');
// plugin
const album = require('./api/album');
const song = require('./api/song');
const user = require('./api/user');
// service
const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
// validator
const AlbumsValidator = require('./validator/album');
const SongValidator = require('./validator/song');
const UserValisdator = require('./validator/user');
// database
require('dotenv').config();

const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const albumService = new AlbumsService();
  const songService = new SongsService();
  const userService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: album,
    options: {
      service: albumService,
      validator: AlbumsValidator,
    },
  });

  await server.register({
    plugin: song,
    options: {
      service: songService,
      validator: SongValidator,
    },
  });

  await server.register({
    plugin: user,
    options: {
      service: userService,
      validator: UserValisdator,
    },
  });

  server.ext('onPreResponse', (request, h) => {
    const {response} = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });

        newResponse.code(response.statusCode);
        return newResponse;
      };

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'There is error on server',
      });

      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();

  console.log(`Server running at ${server.info.uri}`);
};

init();
