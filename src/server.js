const Hapi = require('@hapi/hapi');
//plugin
const album = require('./api/album');
const song = require('./api/song')
//service
const AlbumsService = require('./services/inMemory/AlbumsService');
const SongsService = require('./services/inMemory/SongsService');
//validator
const AlbumsValidator = require('./validator/album');
const SongValidator = require('./validator/song')

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
    
    await server.start();

    console.log(`Server running at ${server.info.uri}`);
};

init();