class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.postSongPlaylistHandler = this.postSongPlaylistHandler.bind(this);
    this.getSongPlaylistHandler = this.getSongPlaylistHandler.bind(this)
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
  async postSongPlaylistHandler(request, h) {
    this._validator.validatePostSongsPlaylistPayload(request.payload);

    const {songId} = request.payload;
    await this._service.verifySongId(songId);

    const {id} = request.params;
    console.log(id);
    const {id: credentialId} = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.addSongsPlaylist(id, songId);

    const response = h.response({
      status: 'success',
      message: 'Song Added to Playlist',
      data: {
        id,
      },
    });
    response.code(201);

    return response;
  }

  async getSongPlaylistHandler(request) {
    const {id: credentialId} = request.auth.credentials;
    const {id} = request.params;

    await this._service.verifyPlaylistOwner(id, credentialId);
    const playlist = await this._service.getSongsPlaylist(id);

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }
}

module.exports = PlaylistHandler;
