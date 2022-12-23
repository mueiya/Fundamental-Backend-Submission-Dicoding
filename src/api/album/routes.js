const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler: handler.postAlbumHandler,
    },
    {
        method: 'GET',
        path: '/albums',
        handler: handler.getAlbumByIdHandler,
    }
]

module.exports = routes;