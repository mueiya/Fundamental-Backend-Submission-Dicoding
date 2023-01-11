const Jwt = require('@hapi/jwt');

const TokenManager = {
  generateAccessToken: (payload ) =>
    Jwt.TokenManager.generate(payload, process.env.ACCESS_TOKEN_KEY),
};
module.exports = TokenManager;
