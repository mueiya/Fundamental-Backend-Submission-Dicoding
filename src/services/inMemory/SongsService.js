const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongService {
    constructor() {
        this._song = [];
    }

    addSong({ 
        title = 'untitled', 
        year,
        genre,
        performer,
        duration,
        albumId,
    }) {
        const id = nanoid(16);
        const newSong = {
            title, 
            year,
            genre,
            performer,
            duration,
            albumId, 
            id,
        };

        this._song.push(newSong);

        const isSuccess = this._song.filter((n) => n.id === id).length > 0;

        if (!isSuccess) {
            throw new InvariantError('Failed to add song');
        }

        return id;
    }
    
    getSongs(){
        return this._song;
    }

    getSongById(id) {
        const song = this._song.filter((n) => n.id === id)[0];
        if (!song) {
            throw new NotFoundError('song not found');
        }
        return song;
    }

    editSongById(id, {title, year, genre, performer, duration, albumId}) {
        const i = this._song.findIndex((n) => n.id === id);
        if (i === -1) {
            throw new NotFoundError('Failed to edit song, id not found.');
        }

        this._album[i] = {
            ...this._album[i],
            title, 
            year,
            genre,
            performer,
            duration,
            albumId, 
        };

        const isSuccess = this._song.filter((n) => n.id === id).length > 0;

        if (!isSuccess) {
            throw new InvariantError('Failed to add song');
        }
    }

    deleteSongById(id) {
        const i = this._song.findIndex((n) => n.id === id);
        if (i === -1) {
            throw new NotFoundError('Failed to delete song, id not found.');
        }   
        this._song.splice(i, 1);

        const isSuccess = this._song.filter((n) => n.id === id).length > 0;

        if (isSuccess) {
            throw new InvariantError('Failed to delete song');
        }
    }
}

module.exports = SongService;