const InvariantError = require('../../exceptions/InvariantError');
const ImageHeaderSchema = require('./schema');

const UploadValidator = {
  validateImageHeader: (headers) => {
    console.log(`validator is running`);
    const validationResult = ImageHeaderSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadValidator;
