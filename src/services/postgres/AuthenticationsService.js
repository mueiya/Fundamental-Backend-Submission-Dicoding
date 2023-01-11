const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationService {
  constructor() {
    this.pool = new Pool();
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentication VALUES($1)',
      values: [token],
    };

    await this.pool.query(query);
  };

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentication WHERE token = $1',
      values: [token],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Refresh token is not valid');
    };
  };

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentication WHERE token = $1',
      values: [token],
    };

    await this.pool.query(query);
  }
};

module.exports = AuthenticationService;
