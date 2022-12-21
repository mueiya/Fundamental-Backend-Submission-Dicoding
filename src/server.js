const Hapi = require('@hapi/hapi');
const album = require('./api/album');
const AlbumService = require('./AlbumService')

const init = async () => {
    const openService = new AlbumService();

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
            service: openService,
        },
    });
    
    await server.start();
    console.log(`Server running at ${server.info.uri}`);
};

init();