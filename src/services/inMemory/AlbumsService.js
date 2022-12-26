const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumService {
    constructor() {
        this._album = [];
    }

    addAlbum({ name, year }) {
        const id = nanoid(16);

        const newAlbum = {
            name, year, id,
        };

        this._album.push(newAlbum);

        const isSuccess = this._album.filter((album) => album.id === id).length > 0;

        if (!isSuccess) {
            throw new InvariantError('Failed to add album');
        }

        return id;
    }

    getAlbumById(id) {
        const album = this._album.filter((n) => n.id === id)[0];
        if (!album) {
            throw new NotFoundError('Album not found');
        }
        return album;
    }

    editAlbumById(id, {name,year}) {
        const index = this._album.findIndex((album) => album.id === id);
        if (index === -1) {
            throw new NotFoundError('Failed to edit album, id not found.');
        }

        this._album[index] = {
            ...this._album[index],
            name,
            year,
        };

        const isSuccess = this._album.filter((album) => album.id === id).length > 0;

        if (!isSuccess) {
            throw new InvariantError('Failed to add album');
        }
    }

    deleteAlbumById(id) {
        const index = this._album.findIndex((album) => album.id === id);
        if (index === -1) {
            throw new NotFoundError('Failed to delete album, id not found.');
        }   
        this._album.splice(index, 1);

        const isSuccess = this._album.filter((album) => album.id === id).length > 0;

        if (isSuccess) {
            throw new InvariantError('Failed to delete album');
        }
    }
}

module.exports = AlbumService;