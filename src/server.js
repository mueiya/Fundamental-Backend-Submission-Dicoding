// Hapi
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
// plugin
const album = require('./api/album');
const song = require('./api/song');
const user = require('./api/user');
const authentication = require('./api/authentication');
// service
const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
const AuthenticationsService =
  require('./services/postgres/AuthenticationsService');
// validator
const AlbumsValidator = require('./validator/album');
const SongValidator = require('./validator/song');
const UserValidator = require('./validator/user');
const AuthenticationValidator = require('./validator/authentication');
// token manager
const TokenManager = require('./tokenize/TokenManager');
// dotenv configuration
require('dotenv').config();

const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const albumService = new AlbumsService();
  const songService = new SongsService();
  const userService = new UsersService();
  const authenticationService = new AuthenticationsService();

  // server configuration
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  /**
   * Hapi Jwt registration and strategy
   * Need executed before the the protected plugin registered
   */
  // registration
  await server.register({
    plugin: Jwt,
  });

  // strategy
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },

    validate: (artifacts) => ({
      inValid: true,
      credential: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  /**
   * all the custom plugin registration
   */
  // album plugin registration
  await server.register({
    plugin: album,
    options: {
      service: albumService,
      validator: AlbumsValidator,
    },
  });
  // song plugin registration
  await server.register({
    plugin: song,
    options: {
      service: songService,
      validator: SongValidator,
    },
  });
  // user plugin registration
  await server.register({
    plugin: user,
    options: {
      service: userService,
      validator: UserValidator,
    },
  });
  // authentication plugin registration
  await server.register({
    plugin: authentication,
    options: {
      authenticationService,
      userService,
      validator: AuthenticationValidator,
      tokenManager: TokenManager,
    },
  });

  /**
   * error handling preRespone in server
   * for avoiding error handling on each handler
   */
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
