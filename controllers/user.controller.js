const User = require("../models/User.model");
const { StatusCodes } = require("http-status-codes");
const createError = require("http-errors");

module.exports.create = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  User.create({ firstName, lastName, email, password })
    .then((userCreated) => {
      res.status(StatusCodes.CREATED).json(userCreated);
    })
    .catch(next);
};

module.exports.list = (req, res, next) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        next(createError(StatusCodes.NOT_FOUND, "User not found"));
      } else {
        res.json(user);
      }
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.currentUserId)
    .then(user => {
      if(!user) {
        return next(createError(StatusCodes.NOT_FOUND, 'user not found'))
      }
      res.json(user)
    })
    .catch(next)
}