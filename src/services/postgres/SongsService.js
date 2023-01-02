const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');

class SongService {
    constructor() {
        this.pool = new Pool();
    }

    async addSong({ 
        title = 'untitled', 
        year,
        genre,
        performer,
        duration,
        albumId,
    }) {
        const id = nanoid(16);

        const query = {
            text: `INSERT INTO song VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            values: [id, title, year, performer, genre, duration, albumId]
        };
        
        const result = await this.pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Failed to add song');
        }

        return result.rows[0].id;
    }
    
    async getSongs(){
        const result = await this.pool.query('SELECT * FROM song');
        return result.rows.map(mapDBToModel);
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM song WHERE id = $1',
            values: [id],
        };
        const result = await this.pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('song not found');
        }
        return result;
    }

    async editSongById(id, {title, year, genre, performer, duration, albumId}) {
        const query = {
            text: 'UPDATE song SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, albumId = $6 WHERE id = $7 RETURNING id',
            values: [title, year, performer, genre, duration, albumId, id ],
        }

        const result = await this.pool.query(query);

        if(!result.rows.length) {
            throw new NotFoundError('song not found');
        }
    }

    async deleteSongById(id) {
        const query = {
            text: 'DELETE song WHERE id = $1 RETURNING id',
            values: [id],
        };
        const result = await this.pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('song not found')
        }
    }
}

module.exports = SongService;