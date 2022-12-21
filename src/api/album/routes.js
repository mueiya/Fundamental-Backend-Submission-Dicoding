const routes = (handler) => [
    {
        method: 'POST',
        path: '/openMusic',
        handler: handler.postAlbumHandler,
    }
]

module.exports = routes;