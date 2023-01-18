// Hapi
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
// plugin
const album = require('./api/album');
const song = require('./api/song');
const user = require('./api/user');
const authentication = require('./api/authentication');
const playlist = require('./api/playlist');
const collaboration = require('./api/collaboration');
const activity = require('./api/activity');
const _export = require('./api/export');
const upload = require('./api/upload');
const like = require('./api/like');
// service
const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
const AuthenticationsService =
  require('./services/postgres/AuthenticationsService');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const CollaborationService =
  require('./services/postgres/CollabolrationsService');
const ActivityService = require('./services/postgres/ActivitiesService');
const ProducerService = require('./services/rabbitmq/ProducerSevice');
const StorageService = require('./services/storage/StorageService');
const LikeService = require('./services/postgres/LikesService');
const CacheService = require('./services/redis/CacheService');
// validator
const CollaborationValidator = require('./validator/collaboration');
const AlbumsValidator = require('./validator/album');
const SongValidator = require('./validator/song');
const UserValidator = require('./validator/user');
const AuthenticationValidator = require('./validator/authentication');
const PlaylistValidator = require('./validator/playlist');
const ExportValidator = require('./validator/export');
const UploadValidator = require('./validator/upload');
// token manager
const TokenManager = require('./tokenize/TokenManager');
// dotenv configuration
require('dotenv').config();
// error handler
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  // call new Service()
  const cacheService = new CacheService();
  const albumService = new AlbumsService(cacheService);
  const songService = new SongsService(cacheService);
  const authenticationService = new AuthenticationsService();
  const userService = new UsersService();
  const activityService = new ActivityService();
  const collaborationService = new CollaborationService();
  const playlistService =
    new PlaylistsService(collaborationService);
  const storageService =
    new StorageService(path.resolve(__dirname, 'api/upload/file/images'));
  const likeService = new LikeService(cacheService);
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
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

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
      isValid: true,
      credentials: {
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
  // playlist plugin registration
  await server.register({
    plugin: playlist,
    options: {
      playlistService,
      validator: PlaylistValidator,
      activityService,
    },
  });
  await server.register({
    plugin: collaboration,
    options: {
      collaborationService,
      playlistService,
      userService,
      validator: CollaborationValidator,
    },
  });
  await server.register({
    plugin: activity,
    options: {
      activityService,
      playlistService,
    },
  });
  await server.register({
    plugin: _export,
    options: {
      service: ProducerService,
      validator: ExportValidator,
      playlistService,
    },
  });
  await server.register({
    plugin: upload,
    options: {
      service: storageService,
      validator: UploadValidator,
      albumService,
    },
  });

  await server.register({
    plugin: like,
    options: {
      likeService,
      albumService,
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
