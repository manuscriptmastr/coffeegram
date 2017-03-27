const { isEmail } = require('validator');
const { isBlank } = require('underscore.string');

const validate = ({name, email, username, passwordFirst, passwordConfirmation}) => {
  var errors = {};
  if (isBlank(name)) {
    errors.name = 'Your name is required';
  }
  if (isBlank(email)) {
    errors.email = 'Your email is required';
  } else if (!isEmail(email)) {
    errors.email = 'The email address is not valid';
  }
  if (isBlank(username)) {
    errors.username = 'A username is required';
  } else if (!(/^\w+$/).test(username)) {
    errors.username = 'Your username should have only letters, numbers, and underscores';
  }
  if (isBlank(passwordFirst)) {
    errors.passwordFirst = 'A password is required';
  }
  if (isBlank(passwordConfirmation)) {
    errors.passwordConfirmation = 'Confirm your password';
  } else if (passwordFirst!==passwordConfirmation) {
    errors.passwordConfirmation = 'Make sure your passwords match';
  }
  return errors;
}

module.exports = validate;
