const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  role: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('mail not valid');
      }
      // const count = this.constructor.countDocuments({ uniqueField: value });
      // if (count !== 0) {
      //   throw new Error('Email already present');
      // }
    },
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    // validate(value) {
    //   const count = this.constructor.countDocuments({ uniqueField: value });
    //   if (count !== 0) {
    //     throw new Error('Phone Number already present');
    //   }
    // },
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minLength: 7,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('invalid password');
      }
    },
  },
  createdBy: {
    createByName: {
      type: String,
      trim: true,
    },
    createById: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
    createByRole: {
      type: String,
      trim: true,
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//methods are accessible for modal instance
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id.toString() }, 'login');
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userData = user.toObject();
  delete userData.password;
  delete userData.tokens;
  return userData;
};

userSchema.statics.findByCredential = async (req) => {
  const email = req.email;
  const phone = req.phone;

  const user = email ? await User.find({ email }) : await User.find({ phone });

  if (!user.length) {
    throw new Error('User not found');
  }
  const userRole = await user[0]?.role;
  const role = email
    ? ['ADMIN', 'CLIENT', 'PROCUREMENT_MANAGER'].includes(userRole)
    : ['INSPECTION_MANAGER'].includes(userRole);

  if (!role) {
    throw new Error(`${email ? 'please login with phone number' : 'please login with Email'}`);
  }

  return user[0];
};

userSchema.statics.findByRole = async (currentUser, user) => {
  let newUser = {};
  const createdBy = {
    createByName: currentUser.name,
    createById: currentUser._id,
    createByRole: currentUser.role,
  };
  if (currentUser.role === 'ADMIN') {
    newUser = {
      ...user,
      createdBy,
    };
  } else if (
    currentUser.role === 'PROCUREMENT_MANAGER' &&
    user.role !== 'ADMIN' &&
    (user.role === 'CLIENT' || 'INSPECTION_MANAGER')
  ) {
    newUser = {
      ...user,
      createdBy,
    };
  } else {
    throw new Error('you are not authorized person to create user or role your selected is not correct ');
  }
  return newUser;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
