class AlbumHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    }

    async postAlbumHandler(request, h) {
        try {
            this._validator.validateAlbumPayload(request.payload);
            const { name = 'untitled', year } = request.payload;

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
            const album = this._service.getAlbumById(id);
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

    putAlbumByIdHandler(request, h) {
        try {
            this._validator.validateAlbumPayload(request.payload);
            const { id } = request.params;
            this._service.editAlbumById(id, request.payload);
            
            return {
                status: 'success',
                message: 'Album Edited'
            };
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.conde(404);
            return response;
        }
    }

    deleteAlbumByIdHandler(request, h) {
        try {
            const { id } = request.params;
            this._service.deleteAlbumById(id);
            return {
                status: 'success',
                message: 'Album deleted'
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