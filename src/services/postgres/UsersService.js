const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserService {
  constructor() {
    this.pool = new Pool();
  }

  async addUser({
    username,
    password,
    fullname,
  }) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO user VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add new user');
    }

    return result.rows[0].id;
  };

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM user WHERE username = $1',
      values: [username],
    };

    const result = await this.pool.query(query);

    if (result.rowCount) {
      throw new InvariantError(`Adding user failed.` +
        ` ${username} already exists`);
    };
  };

  async getUserById(id) {
    const query = {
      text: 'SELECT id, username, fullname FROM user WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('User not found');
    };

    return result.rows[0];
  }
};

module.exports = UserService;
