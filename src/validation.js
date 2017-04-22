const { isBlank } = require('underscore.string');

const validate = ({name, email, username, passwordFirst, passwordConfirmation}) => {
  var errors = {};
  if (isBlank(passwordConfirmation)) {
    errors.passwordConfirmation = { message: 'Confirm your password' };
  } else if (passwordFirst!==passwordConfirmation) {
    errors.passwordConfirmation = { message: 'Make sure your passwords match' };
  }
  return errors;
}

module.exports = validate;
