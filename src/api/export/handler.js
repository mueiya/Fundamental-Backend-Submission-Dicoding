class ExportHandler {
  constructor(service, validator, playlistService) {
    this._service = service;
    this._validator = validator;
    this._playlistService = playlistService;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);
    const {id: credentialId} = request.auth.credentials;
    const {id} = request.params;
    console.log(id);
    await this._playlistService.isPlaylist(id);
    await this._playlistService.verifyPlaylistAccess(id, credentialId);
    const playlist = await this._playlistService.getSongsPlaylist(id);

    // deleting username
    delete playlist.username;

    const message = {
      playlist,
    };

    // eslint-disable-next-line max-len
    await this._service.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportHandler;
