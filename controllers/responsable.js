const httpError = require("../models/error");

const responsable = require("../models/responsable");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { name, email, password, tel, adresse } = req.body;
  let existinguser;
  try {
    existinguser = await responsable.findOne({ email: email });
  } catch (err) {
    const error = new httpError("problems!!!", 500);
    return next(error);
  }

  if (existinguser) {
    const error = new httpError("user exist", 422);
    return next(error);
  }

  const createduser = new responsable({
    name,
    email,
    password,
    tel,
    adresse,
    produits: [],
  });

  try {
    await createduser.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createduser.id, email: createduser.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createduser.id, email: createduser.email, token: token });
};

const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await responsable.findOne({ email: email });
  } catch {
    return next(new httpError("failed !!", 500));
  }
  if (!existingUser || existingUser.password !== password) {
    return next(new httpError("invalid input passed", 422));
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.status(200).json({ user: existingUser, token: token });
};

const getuser = async (req, res, next) => {
  let existingUser;
  try {
    existingUser = await responsable.find();
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ existingUser: existingUser });
};

exports.signup = signup;
exports.login = login;
exports.getuser = getuser
