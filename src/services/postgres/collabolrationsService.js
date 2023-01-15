const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class CollaborationService {
  constructor() {
    this.pool = new Pool();
  }

  async addCollaboration(playlistId, UserId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, UserId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add collaboration');
    }

    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, UserId) {
    const query = {
      text: `DELETE FROM collaborations 
      WHERE playlistId = $1 AND userId = $2 
      RETURNING id`,
      values: [playlistId, UserId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to delete collaboration');
    }
  }

  async verifyCollaboration(playlistId, userId) {
    const query = {
      text: `SELECT * 
      FROM collaborations 
      WHERE playlistId = $1 AND userId = $2`,
      values: [playlistId, userId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to Verified collaboration');
    }
  }
}

module.exports = CollaborationService;
