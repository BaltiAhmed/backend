const httpError = require("../models/error");

const fournisseur = require("../models/fournisseur");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { name, email, tel, adresse } = req.body;
  let existinguser;
  try {
    existinguser = await fournisseur.findOne({ email: email });
  } catch (err) {
    const error = new httpError("problems!!!", 500);
    return next(error);
  }

  if (existinguser) {
    const error = new httpError("fournisseur exist", 422);
    return next(error);
  }

  const createduser = new fournisseur({
    name,
    email,
    tel,
    adresse,
  });

  try {
    await createduser.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ fournisseur: createduser });
};

const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await fournisseur.findOne({ email: email });
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
  res.status(200).json({ fournisseur: existingUser, token: token });
};

const getfournisseur = async (req, res, next) => {
  let existingUser;
  try {
    existingUser = await fournisseur.find();
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ fournisseur: existingUser });
};

const updatefournisseur = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { name, email, tel, adresse } = req.body;
  const UserId = req.params.id;
  let existingUser;
  try {
    existingUser = await fournisseur.findById(UserId);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingUser.name = name;
  existingUser.email = email;
  existingUser.tel = tel;
  existingUser.adresse = adresse;

  try {
    existingUser.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ existingUser: existingUser });
};

const deletefournisseur = async (req, res, next) => {
  const id = req.params.id;
  let existingUser;

  try {
    existingUser = await fournisseur.findById(id);
  } catch {
    return next(new httpError("failed !!", 500));
  }
  if (!existingUser) {
    return next(new httpError("user does not exist !!", 500));
  }
  try {
    existingUser.remove();
  } catch {
    return next(new httpError("failed !!!", 500));
  }
  res.status(200).json({ message: "deleted" });
};

const getfournisseurById = async (req, res, next) => {
  const userId = req.params.id;
  let existingUser;
  try {
    existingUser = await fournisseur.findById(userId);
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ fournisseur: existingUser });
};

exports.signup = signup;
exports.login = login;
exports.getfournisseur = getfournisseur;
exports.updatefournisseur = updatefournisseur;
exports.deletefournisseur = deletefournisseur;
exports.getfournisseurById = getfournisseurById;
