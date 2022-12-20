class AlbumHandler {
    constructor(service) {
        this._service = service;

    }

    postAlbumHandler(request, h) {
        try {
            const { name, year} =request.payload;

            this._service.addAlbum({name, year});
            const albumId = this._service.addAlbum({name, year});
            const response = h.response({
                status: 'success',
                message: 'album added'
                data: {
                    albumId,
                }
            })
        }
    }
}

module.exports = AlbumHandler;