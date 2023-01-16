/* eslint-disable max-len */
/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('songs', {
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
      notNull: false,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
  });
  // adding fk (album_id)
  pgm.addConstraint('songs', 'fk_song_album', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
