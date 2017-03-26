const { isEmail } = require('validator');
const { isBlank } = require('underscore.string');

const validate = ({name, email, username, passwordFirst, passwordConfirmation}) => {
  errors = [];
  if (isBlank(name)) {
    errors.push({field: 'name', message: 'Your name is required'});
  }
  if (isBlank(email)) {
    errors.push({field: 'email', message: 'Your email is required'});
  } else if (!isEmail(email)) {
    errors.push({field: 'email', message: 'The email address is not valid'});
  }
  if (isBlank(username)) {
    errors.push({field: 'username', message: 'A username is required'});
  } else if (!(/^\w+$/).test(username)) {
    errors.push({field: 'username', message: 'Your username should have only letters, numbers, and underscores'});
  }
  if (isBlank(passwordFirst)) {
    errors.push({field: 'passwordFirst', message: 'A password is required'});
  }
  if (isBlank(passwordConfirmation)) {
    errors.push({field: 'passwordConfirmation', message: 'Confirm your password'});
  } else if (passwordFirst!==passwordConfirmation) {
    errors.push({field: 'passwordConfirmation', message: 'Make sure your passwords match'});
  }
  return errors;
}

module.exports = validate;
