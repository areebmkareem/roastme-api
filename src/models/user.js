const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {sendWelcomeEmail} = require('../emails/account');
const {error} = require('winston');

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      // required: true,
      type: Number,
    },
    profileImage: String,
    otp: {
      value: {type: Number, required: false},
      createdAt: {type: Date, required: false},
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    contacts: [String],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.statics.getCredentials = async function (email, password) {
  try {
    let user = await User.findOne({email});
    if (!user) throw 'User not found!';
    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) return user;
    else throw 'Email / Password is incorrect!';
  } catch (err) {
    throw err;
  }
};

//Methods
userSchema.methods.toJSON = function () {
  try {
    const excludeKeys = ['password', 'tokens', 'otp', 'createdAt', 'updatedAt'];
    const user = this;
    const userObject = user.toObject();
    excludeKeys.forEach((key) => delete userObject[key]);
    return userObject;
  } catch (error) {
    throw error;
  }
};

userSchema.methods.generateTokenId = async function (TYPE) {
  try {
    const user = this;
    let token = await jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token});
    return {user, token};
  } catch (error) {
    throw error;
  }
};

userSchema.pre('save', async function (next) {
  try {
    const user = this;
    if (user._id) return;
    const userExist = await User.findOne({email: user.email});
    if (userExist) throw new Error('User already exist');
    if (user.isModified('password')) user.password = await bcrypt.hash(user.password, 8);
    next();
  } catch (error) {
    throw error;
  }
});

userSchema.post('save', function (doc) {
  // sendWelcomeEmail(doc.email, doc.name);
});

let User = new mongoose.model('users', userSchema);

module.exports = User;
