class AlbumHandler {
    constructor(service) {
        this._service = service;

        this.postAlbumHandler = this.postAlbumHandler.bind(this);
    }

    async postAlbumHandler(request, h) {
        try {
            const { name, year } = request.payload;

            this._service.addAlbum({name, year});
            const albumId = await this._service.addAlbum({ name, year });
            const response = h.response({
                status: 'success',
                message: 'album added',
                data: {
                    albumId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(400);
            return response;
        }
    }

    getAlbumByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const note = this._service.getAlbumById(id);
            return{
                status: 'success',
                data: {
                    album,
                }
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(404);
            return response;
        }
    } 
}

module.exports = AlbumHandler;