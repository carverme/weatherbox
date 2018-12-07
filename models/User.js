const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'You must enter a name.'],
    minLength: [1, 'Name must be between 1 and 99 characters.'],
    maxLength: [99, 'Name must be between 1 and 99 characters.']
  },
  password: {
    type: String,
    required: [true, 'You must enter a password.'],
    minLength: [8, 'Password must be between 8 and 99 characters.'],
    maxLength: [99, 'Password must be between 8 and 99 characters.']
  },
  email: {
    type: String,
    required: [true, 'You must enter an e-mail.'],
    minLength: [5, 'E-mail must be between 5 and 99 characters.'],
    maxLength: [99, 'E-mail must be between 5 and 99 characters.']
  }
});

// This returns a user object without a password.
userSchema.set('toObject', {
  transform: function(doc, ret, options) {
    let returnJson = {
      _id: ret._id,
      email: ret.email,
      name: ret.name
    }
    return returnJson;
  }
});

//This checks the entered password against the hashed password.
userSchema.methods.authenticated = function(password) {
  return bcrypt.compareSync(password, this.password)
};

userSchema.pre('save', function(next) {
  if (this.isNew) {
    let hash = bcrypt.hashSync(this.password, 12);
    this.password = hash;
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
