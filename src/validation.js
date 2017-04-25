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
  if (image[0].size === 0) {
    errors.image = { message: 'No image detected' };
  } else if (image[0].type !== 'image/jpeg'){
    errors.image = { message: 'Image must be JPEG' };
  }
  return errors;
}

module.exports = {
  validatePassword,
  validateImage
};
