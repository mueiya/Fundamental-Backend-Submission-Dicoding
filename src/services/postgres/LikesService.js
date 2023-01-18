const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class LikeService {
  constructor() {
    this.pool = new Pool();
  }

  async likeAlbum(userId, albumId) {
    // checking like
    const qLike = {
      text: `
            SELECT id
            FROM likes
            WHERE user_id = $1 and album_id = $2`,
      values: [userId, albumId],
    };

    const qLikeResult = await this.pool.query(qLike);

    if (!qLikeResult.rowCount) {
      const message = await this.addLike(userId, albumId);
      return message;
    }

    const message = await this.deleteLike(userId, albumId);
    return message;
  }

  async getLike(albumId) {
    const query = {
      text: `
        SELECT *
        FROM likes
        WHERE album_id = $1`,
      values: [albumId],
    };

    const result = await this.pool.query(query);

    return result.rowCount;
  }

  async addLike(userId, albumId) {
    const id = `like-${nanoid(16)}`;

    const query = {
      text: `
            INSERT INTO likes
            VALUES($1, $2, $3)
            RETURNING id`,
      values: [id, userId, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to like album');
    }

    const message = `Likes Album`;

    return message;
  }

  async deleteLike(userId, albumId) {
    const query ={
      text: `
        DELETE 
        FROM likes 
        WHERE user_id = $1 and album_id = $2
        RETURNING id`,
      values: [userId, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('like status not found');
    }

    const message = 'Likes Album Removed';

    return message;
  }
}

module.exports = LikeService;
