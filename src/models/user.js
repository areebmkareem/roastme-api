const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail } = require('../emails/account');

const userSchema = mongoose.Schema(
  {
    name: {
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
  }
);

userSchema.statics.getCredentials = async function (email, password) {
  try {
    let user = await User.findOne({ email });
    if (!user) throw 'User not found!';
    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) return user;
    else throw 'Email / Password is wrong!';
  } catch (err) {
    throw err;
  }
};
userSchema.statics.checkIfUseAlreadyExist = async (email) => {
  try {
    let user = await User.findOne({ email });
    if (user) throw 'User already exist';
  } catch (error) {
    throw error;
  }
};
//Methods
userSchema.methods.generateTokenId = async function () {
  const user = this;
  try {
    let token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    user.save();
    return { user, token };
  } catch (error) {
    throw error;
  }
};

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) user.password = await bcrypt.hash(user.password, 8);

  next();
});

userSchema.post('save', function (doc) {
  // sendWelcomeEmail(doc.email, doc.name);
});

let User = new mongoose.model('users', userSchema);

module.exports = User;
