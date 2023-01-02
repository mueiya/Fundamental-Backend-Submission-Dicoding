/* eslint-disable camelcase */
//failed table
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('song', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        year: {
            type: 'INTEGER',
            notNull: true,
        },
        performer: {
            type: 'TEXT',
            notNull: true,
        },
        genre: {
            type: 'TEXT',
            notNull: true,
        },
        duration: {
            type: 'INTEGER',
            notNull: true,
        },
        album_id: {
            type: 'VARCHAR(50)',
            notNull: false,
        },
        album: {
            type: 'TEXT',
            notNull: false,
        },
    })
};

exports.down = pgm => {
    pgm.dropTable('song');
};
