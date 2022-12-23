const Hapi = require('@hapi/hapi');
const album = require('./api/album');
const song = require('./api/song')
const AlbumsService = require('./services/inMemory/AlbumsService');
const SongsService = require('./services/inMemory/SongsService');
const AlbumsValidator = require('./validator/album');

const init = async () => {
    const albumService = new AlbumsService();
    const songService = new SongsService();

    const server = Hapi.server({
        port: 5000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            }
        }
    });

    await server.register({
        plugin: album,
        option: {
            service: albumService,
            validator: AlbumsValidator,
        },
    });

    await server.register({
        plugin: song,
        option: {
            service: songService,
        },
    });
    
    await server.start();

    console.log(`Server running at ${server.info.uri}`);
};

init();