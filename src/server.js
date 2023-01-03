const Hapi = require('@hapi/hapi');
//plugin
const album = require('./api/album');
const song = require('./api/song')
//service
const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');
//validator
const AlbumsValidator = require('./validator/album');
const SongValidator = require('./validator/song')
//database
require('dotenv').config();

const init = async () => {
    const albumService = new AlbumsService();
    const songService = new SongsService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
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