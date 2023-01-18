class UploadHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    console.log(`postUploadImageHandler is running`);

    const {cover} = request.payload;
    console.log(cover);
    this._validator.validateImageHeader(cover.hapi.headers);
    console.log(`validation success`);

    const filename = await this._service.writeFile(cover, cover.hapi);

    const response = h.response({
      status: 'success',
      message: 'Cover uploaded successfully',
      data: {
        fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadHandler;
