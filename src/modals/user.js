const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    status: {
      require: true,
      type: Number,
    },
    tokens: [
      {
        token: {
          type: String,
          require: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.statics.getCredentials = async function (email, password) {
  let user = await User.findOne({ email });
  if (!user) return { error: true, message: 'User not found!' };
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) return user;
  else return { error: true, message: 'Password is wrong!' };
};
userSchema.statics.checkIfUseAlreadyExist = async (email) => {
  try {
    let user = await User.findOne({ email });
    if (user) throw { error: true, message: 'User already exist' };
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

let User = new mongoose.model('users', userSchema);

module.exports = User;
