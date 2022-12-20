const hapi = require('@hapi/hapi');
const album = require('./api/album');
const AlbumService = require('./services/inMemory/albumService')

const init = async () => {
    const openService = new AlbumService();

    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
    });
    
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();