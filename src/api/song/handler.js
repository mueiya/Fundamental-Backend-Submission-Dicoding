class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const songId = await this._service.addSong(request.payload);

    const response = h.response({
      status: 'success',
      message: 'song added',
      data: {
        songId,
      },
    });
    response.code(201);

    return response;
  };

  async getSongsHandler(request, h) {
    const params = request.query;
    const {cache, songs} = await this._service.getSongs(params);

    const response = h.response({
      status: 'success',
      data: {
        songs,
      },
    });
    if (cache) response.header('X-Data-Source', 'cache');
    return response;
  };

  async getSongByIdHandler(request, h) {
    const {id} = request.params;
    const {cache, song} = await this._service.getSongById(id);

    const response = h.response( {
      status: 'success',
      data: {
        song,
      },
    });

    if (cache) response.header('X-Data-Source', 'cache');
    return response;
  };

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {id} = request.params;
    await this._service.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Song Edited',
    };
  };

  async deleteSongByIdHandler(request, h) {
    const {id} = request.params;
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Song deleted',
    };
  };
};

module.exports = SongHandler;
