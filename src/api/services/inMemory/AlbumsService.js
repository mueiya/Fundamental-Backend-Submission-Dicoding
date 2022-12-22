const { nanoid } = require('nanoid');

class AlbumService {
    constructor() {
        this._album = [];
    }

    addAlbum({ name, year}) {
        const id = nanoid(16);

        const newAlbum = {
            name, year, id,
        };

        this._album.push(newAlbum);

        const isSuccess = this._album.filter((album) => album.id === id).length > 0;

        if (!isSuccess) {
            throw new Error('Failed to add album');
        }

        return id;
    }

    getAlbumById(id) {
        const album = this._album.filter((n) => n.id === id)[0];
        if (!album) {
            throw new Error('Album not found');
        }
        return album;
    }

    editAlbumById(id, {name,year}) {
        const index = this._album.findIndex((album) => album.id === id);
        if (index === -1) {
            throw new Error('Failed to edit album, id not found.');
        }

        this._album[index] = {
            ...this._album[index],
            name,
            year,
        };

        const isSuccess = this._album.filter((album) => album.id === id).length > 0;

        if (!isSuccess) {
            throw new Error('Failed to add album');
        }
    }

    deleteAlbumById(id) {
        const index = this._album.findIndex((album) => album.id === id);
        if (index === -1) {
            throw new Error('Failed to delete album, id not found.');
        }   
        this._album.splice(index, 1);

        const isSuccess = this._album.filter((album) => album.id === id).length > 0;

        if (isSuccess) {
            throw new Error('Failed to delete album');
        }
    }
}

module.exports = AlbumService;