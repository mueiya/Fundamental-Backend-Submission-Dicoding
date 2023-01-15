const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistService {
  constructor(collaborationService) {
    this.pool = new Pool();
    this._collaborationService = collaborationService;
  };

  async addPlaylist({name, owner}) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO playlists VALUES($1, $2, $3) RETURNING id`,
      values: [id, name, owner],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add playlist');
    };

    return result.rows[0].id;
  };

  async getPlaylist(owner) {
    const query = {
      text: `SELECT id, name, owner AS username 
      FROM playlists 
      WHERE owner = $1`,
      values: [owner],
    };

    console.log('getPlaylist execute');
    const result = await this.pool.query(query);
    return result.rows;
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: `SELECT * FROM playlists WHERE id = $1`,
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist not found');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Access Forbiden');
    }
  }
  async verifyPlaylistAccess(playlistId, userId) {

  }
}

module.exports = PlaylistService;
