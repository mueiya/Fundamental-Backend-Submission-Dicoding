const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const {mapDBToModel, mapDBToModelAll} = require('../../utils');

class SongService {
  constructor() {
    this.pool = new Pool();
  };

  async addSong({
    title = 'untitled',
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO song VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add song');
    };

    return result.rows[0].id;
  };

  async getSongs(params) {
    const title = params.title;
    const performer = params.performer;
    const query = {
      text: 'SELECT * FROM song',
    };

    const result = await this.pool.query(query);
    const songs = result.rows.map(mapDBToModelAll);
    if (Object.keys(params).length === 0) {
      return songs;
    } else if (params.title) {
      const matchTitle = songs.filter((e) =>
        e.title.toLowerCase().includes(title.toLowerCase()));

      if (params.performer) {
        const matchBoth = matchTitle.filter((e) =>
          e.performer.toLowerCase().includes(performer.toLowerCase()));

        return matchBoth;
      };

      return matchTitle;
    } else {
      const matchPerformer = songs.filter((e) =>
        e.performer.toLowerCase().includes(performer.toLowerCase()));

      return matchPerformer;
    };
  };

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM song WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('song not found');
    };

    return result.rows.map(mapDBToModel)[0];
  };

  async editSongById(id, {title, year, genre, performer, duration, albumId}) {
    const query = {
      // eslint-disable-next-line max-len
      text: 'UPDATE song SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('song not found');
    };
  };

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM song WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('song not found');
    };
  };
};

module.exports = SongService;
