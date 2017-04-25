const isEmpty = v => v === 0;
const isJpeg = v => v === 'image/jpeg';

const validatePassword = ({ passwordFirst, passwordConfirmation }) => {
  var errors = {};
  if (isBlank(passwordConfirmation)) {
    errors.passwordConfirmation = { message: 'Confirm your password' };
  } else if (passwordFirst!==passwordConfirmation) {
    errors.passwordConfirmation = { message: 'Make sure your passwords match' };
  }
  return errors;
}

const validateImage = ({ image }) => {
  var errors = {};
  if (isEmpty(image[0].size)) {
    errors.image = { message: 'No image detected' };
  } else if (!isJpeg(image[0].type)){
    errors.image = { message: 'Image must be JPEG' };
  }
  return errors;
}

module.exports = {
  validatePassword,
  validateImage
};
