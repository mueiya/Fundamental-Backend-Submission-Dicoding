const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const {mapDBToModelAlbum} = require('../../utils');
const {mapDBToModelAll} = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumService {
  constructor() {
    this.pool = new Pool();
  };

  async addAlbum({name, year}) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO album VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add album');
    };

    return result.rows[0].id;
  };

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM album WHERE id = $1',
      values: [id],
    };

    const songquery = {
      text: 'SELECT id, title, performer FROM song WHERE album_id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);
    const song = await this.pool.query(songquery);

    if (!result.rows.length) {
      throw new NotFoundError('song not found');
    };

    if (!song.rows.length) {
      return result.rows.map(mapDBToModelAlbum)[0];
    };
    const albumSong = result.rows.map(mapDBToModelAlbum)[0];
    albumSong.songs = song.rows.map(mapDBToModelAll);

    return albumSong;
  };

  async editAlbumById(id, {name, year}) {
    const query = {
      text: 'UPDATE album SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to edit album, id not found.');
    };
  };

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM album WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('song not found');
    };
  };
};

module.exports = AlbumService;
