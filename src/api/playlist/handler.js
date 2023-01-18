class PlaylistHandler {
  constructor(service, validator, activityService) {
    this._service = service;
    this._validator = validator;
    this.activityService = activityService;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.postSongPlaylistHandler = this.postSongPlaylistHandler.bind(this);
    this.getSongPlaylistHandler = this.getSongPlaylistHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.deleteSongPlaylistHandler = this.deleteSongPlaylistHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
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

  async getPlaylistHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;

    const {playlists} = await this._service.getPlaylist(credentialId);

    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
    return response;
  }

  async deletePlaylistHandler(request) {
    const {id: credentialId} = request.auth.credentials;
    const {id} = request.params;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id, credentialId);

    return {
      status: 'success',
      message: 'playlist deleted',
    };
  }

  async postSongPlaylistHandler(request, h) {
    this._validator.validatePostSongsPlaylistPayload(request.payload);

    const {songId} = request.payload;
    await this._service.verifySongId(songId);

    const {id} = request.params;
    const {id: credentialId} = request.auth.credentials;

    await this._service.verifyPlaylistAccess(id, credentialId);
    await this._service.addSongsPlaylist(id, songId, credentialId);

    await this.activityService.recordAdd({
      playlistId: id,
      songId: songId,
      userId: credentialId,
    });

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

  async getSongPlaylistHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {id} = request.params;

    await this._service.verifyPlaylistAccess(id, credentialId);
    const {playlist} = await this._service.getSongsPlaylist(id);

    const response = h.response({
      status: 'success',
      data: {
        playlist,
      },
    });

    return response;
  }

  async deleteSongPlaylistHandler(request) {
    await this._validator.validateDeleteSongsPlaylistPayload(request.payload);
    const {songId} = request.payload;

    const {id: credentialId} = request.auth.credentials;
    const {id} = request.params;

    await this._service.verifyPlaylistAccess(id, credentialId);
    await this._service.deleteSongPlaylist(id, songId, credentialId);

    await this.activityService.recordDelete({
      playlistId: id,
      songId: songId,
      userId: credentialId,
    });

    return {
      status: 'success',
      message: 'songs deleted from playlist',
    };
  }
  // Checking Playlist with playlistid
  async isPlaylist(playlistId) {
    const query = {
      text: `
        SELECT id
        FROM playlist
        WHERE id = $1`,
      values: [playlistId],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('activity not found');
    }
  }
}

module.exports = PlaylistHandler;
