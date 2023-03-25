const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
  REQUIRE_FIELD,
  REQUIRE_LENGTH,
  INVALID_EMAIL,
} = require("../config/errorMessages.config");

const ROUNDS = 10;

const EMAIL_PATTERN =
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, REQUIRE_FIELD],
    },
    lastName: {
      type: String,
      required: [true, REQUIRE_FIELD],
    },
    email: {
      type: String,
      required: [true, REQUIRE_FIELD],
      match: [EMAIL_PATTERN, INVALID_EMAIL],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, REQUIRE_FIELD],
      minlength: [8, REQUIRE_LENGTH],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, ROUNDS).then((hash) => {
      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

UserSchema.methods.checkPassword = function (passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
