const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const {mapDBToModelGetAlbum} = require('../../utils');

class AlbumService {
  constructor(cacheService) {
    this._cacheService = cacheService;
    this.pool = new Pool();
  };

  async addAlbum({name, year}) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add album');
    };

    return result.rows[0].id;
  };

  async getAlbumById(id) {
    try {
      console.log('from cache');
      const result = await this._cacheService.get(`getalbum:${id}`);
      const parsing = JSON.parse(result);
      const cache = true;
      return {
        cache,
        album: parsing,
      };
    } catch (error) {
      const query = {
        text: `
        SELECT id, name, year, cover_url
        FROM albums 
        WHERE id = $1`,
        values: [id],
      };

      const songquery = {
        text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
        values: [id],
      };

      const album = await this.pool.query(query);
      const song = await this.pool.query(songquery);

      if (!album.rowCount) {
        throw new NotFoundError('song not found');
      };

      const albumSong = album.rows.map(mapDBToModelGetAlbum)[0];
      // inserting songs object
      albumSong.songs = song.rows;

      await this._cacheService.set(
          `getalbum:${id}`,
          JSON.stringify(albumSong),
      );

      return {album: albumSong};
    }
  };

  async editAlbumById(id, {name, year}) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to edit album, id not found.');
    };

    await this._cacheService.delete(`getalbum:${id}`);
  };

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('song not found');
    };

    await this._cacheService.delete(`getalbum:${id}`);
  };

  async addCoverUrlAlbum(id, dir) {
    console.log(dir);
    const query = {
      text: `
      UPDATE albums
      SET cover_url = $1
      WHERE id = $2
      RETURNING id`,
      values: [dir, id],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('failed to add cover, album not found');
    };

    await this._cacheService.delete(`getalbum:${id}`);
  }
};

module.exports = AlbumService;
