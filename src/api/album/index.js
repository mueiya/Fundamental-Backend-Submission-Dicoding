const AlbumHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'album',
    register: async (server, {service}) => {
        const albumHandler = new AlbumHandler(service);
        server.route(routes(albumHandler));
    }
}