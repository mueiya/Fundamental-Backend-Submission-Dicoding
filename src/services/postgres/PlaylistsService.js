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

  async addSongsPlaylist(playlistId, songId) {
    const id = `song_playlist-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO song_to_playlist 
      VALUES($1, $2, $3) 
      RETURNING id`,
      values: [id, playlistId, songId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('failed to add song to playlist');
    };

    return result.rows[0].id;
  }

  async verifySongId(songId) {
    const query = {
      text: `SELECT id FROM songs WHERE id = $1`,
      values: [songId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('SongId not found');
    }
  }

  async getPlaylist(owner) {
    const query = {
      text: `SELECT id, name, owner AS username 
      FROM playlists 
      WHERE owner = $1`,
      values: [owner],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getSongsPlaylist(playlistId) {
    const songQuery = {
      text: `
      SELECT songs.id, songs.title, songs.performer
      FROM songs
      INNER JOIN song_to_playlist As rel
      ON rel.song_id=songs.id
      WHERE rel.playlist_id = $1`,
      values: [playlistId],
    };
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name, users.username
      FROM playlists
      INNER JOIN users
      ON playlists.owner = users.id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const songs = await this.pool.query(songQuery);
    const playlist = await this.pool.query(playlistQuery);

    const data = playlist.rows[0];
    data.songs = songs.rows;

    return playlist.rows[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('playlist not found');
    };
  }

  async deleteSongPlaylist(id, songId) {
    const query = {
      text: `DELETE
      FROM song_to_playlist
      WHERE playlist_id = $1 AND song_id = $2
      RETURNING id`,
      values: [id, songId],
    };

    console.log(`${songId} removed from ${id}`);
    const result = await this.pool.query(query);
    console.log(result.rows);

    if (!result.rowCount) {
      throw new NotFoundError('playlist not found');
    };
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

    console.log(`${owner} verified as playlist owner`);
  }
  async verifyPlaylistAccess(playlistId, userId) {

  }
}

module.exports = PlaylistService;
