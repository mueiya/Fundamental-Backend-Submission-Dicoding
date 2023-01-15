class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    console.log('postPlaylist executed');
    this._validator.validatePostPlaylistPayload(request.payload);

    const {name} = request.payload;
    const {id: credentialId} = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({
      name,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist Added',
      data: {
        playlistId,
      },
    });
    response.code(201);

    return response;
  };

  async getPlaylistHandler(request) {
    const {id: credentialId} = request.auth.credentials;

    const playlists = await this._service.getPlaylist(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }
}

module.exports = PlaylistHandler;
