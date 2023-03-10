/* eslint-disable max-len */
const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => {
    return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  },
  generateRefreshToken: (payload) => {
    return Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY);
  },
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifact = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifact, process.env.REFRESH_TOKEN_KEY);
      const {payload} = artifact.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh Token is not valid');
    }
  },
};
module.exports = TokenManager;
