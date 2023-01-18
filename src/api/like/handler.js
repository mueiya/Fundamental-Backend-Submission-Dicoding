class LikeHandler {
  constructor(likeService, albumService) {
    this._likeService = likeService;
    this._albumService = albumService;

    this.getLikeAlbumHandler = this.getLikeAlbumHandler.bind(this);
    this.postLikeAlbumHandler = this.postLikeAlbumHandler.bind(this);
  }

  async postLikeAlbumHandler(request, h) {
    const {id: credentialId} = request.auth.credentials;
    const {id} = request.params;

    await this._albumService.getAlbumById(id);
    const message = await this._likeService.likeAlbum(credentialId, id);

    const response = h.response({
      status: 'success',
      message,
    });
    response.code(201);
    return response;
  }

  async getLikeAlbumHandler(request) {
    const {id} = request.params;
    await this._albumService.getAlbumById(id);

    const likes = await this._likeService.getLike(id);

    return {
      status: 'success',
      data: {
        likes,
      },
    };
  }
}

module.exports = LikeHandler;
