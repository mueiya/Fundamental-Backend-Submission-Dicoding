const {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationValidator = {
  validatePostAuthenticationPayload: ({username, password}) => {
    const validationResult = PostAuthenticationPayloadSchema.validate({
      username,
      password,
    });
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePutAuthenticationPayload: (payload) => {
    const validationResult = PutAuthenticationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteAuthenticationPayload: (payload) => {
    console.log('validation running');
    const validationResult =
    DeleteAuthenticationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationValidator;
