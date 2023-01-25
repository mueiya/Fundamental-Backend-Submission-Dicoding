class AuthenticationHandler {
  constructor(authenticationService, userService, tokenManager, validator) {
    this._authenticationService = authenticationService;
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
    this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    const {username, password} = request.payload;
    this._validator.validatePostAuthenticationPayload({
      username,
      password,
    });
    const id = await this._userService.verifyUserCredential({
      username,
      password,
    });

    const accessToken = this._tokenManager.generateAccessToken({id});
    const refreshToken = this._tokenManager.generateRefreshToken({id});
    await this._authenticationService.addRefreshToken(refreshToken);

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

  async putAuthenticationHandler(request) {
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

  async deleteAuthenticationHandler(request) {
    this._validator.validateDeleteAuthenticationPayload(request.payload);

    const {refreshToken} = request.payload;
    await this._authenticationService.verifyRefreshToken(refreshToken);
    await this._authenticationService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Access token deleted',
    };
  }
};

module.exports = AuthenticationHandler;
