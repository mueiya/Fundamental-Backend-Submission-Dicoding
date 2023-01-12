class AuthenticationHandler {
  constructor(authenticationService, userService, tokenManager, validator) {
    this._authenticationService = authenticationService;
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._validator = validator;
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationHandlerPayload(request.payload);

    const {username, password} = request.payload;
    const id = await this._userService.verifyUserCredential(username, password);

    const accessToken = this._tokenManager.generateAccessToken({id});
    const refreshToken = this._tokenManager.generateRefreshToken({id});

    await this._authenticationService.verifyRefreshToken * (refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Authentication added',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request, h) {
    this._validator.validatePutAuthenticationPayload(request.payload);

    const {refreshToken} = request.payload;
    await this._authenticationService.verifyRefreshToken(refreshToken);
    const {id} = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({id});

    return {
      status: 'success',
      message: 'Access token updated',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request, h) {
    this._validator.validateDeleteAuthenticationPayload(request.payload);

    const {refreshToken} = request.payload;
    await this._authenticationService.verifyRefreshToken(refreshToken);
    await this._authenticationService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh token deleted',
    };
  }
};

module.exports = AuthenticationHandler;
