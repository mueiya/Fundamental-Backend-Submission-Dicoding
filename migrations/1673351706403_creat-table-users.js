/* eslint-disable valid-jsdoc */
/* eslint-disable camelcase */

/**
 * i dont really know why?
 * but i cant use "user" as table name
 * use "users" instead.
 */
exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    username: {
      type: 'TEXT',
      unique: true,
      notNull: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    fullname: {
      type: 'TEXT',
      notNull: true,
    },
  } );
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
