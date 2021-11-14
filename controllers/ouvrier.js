const httpError = require("../models/error");

const ouvrier = require("../models/ouvrier");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");
const generator = require("generate-password");

const nodemailer = require("nodemailer");
const log = console.log;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL || "ismaahenaayaachi@gmail.com", // TODO: your gmail account
    pass: process.env.PASSWORD || "sousou47", // TODO: your gmail password
  },
});

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { name, email, tel, adresse } = req.body;
  const password = generator.generate({
    length: 10,
    uppercase: false,
  });

  let existinguser;
  try {
    existinguser = await ouvrier.findOne({ email: email });
  } catch (err) {
    const error = new httpError("problems!!!", 500);
    return next(error);
  }

  if (existinguser) {
    const error = new httpError("user exist", 422);
    return next(error);
  }

  const createduser = new ouvrier({
    name,
    email,
    password,
    tel,
    adresse,
    commande: [],
  });

  try {
    await createduser.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  let mailOptions = {
    from: "ismaahenaayaachi@gmail.com", // TODO: email sender
    to: email, // TODO: email receiver
    subject: "Confirmation de creation de compte ouvrier",
    text: "Votre Mot de passe est: " + password,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return log("Error occurs");
    }
    return log("Email sent!!!");
  });

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

  res.status(201).json({
    ouvrierId: createduser.id,
    email: createduser.email,
    token: token,
  });
};

const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await ouvrier.findOne({ email: email });
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
  res.status(200).json({ ouvrier: existingUser, token: token });
};

const getouvrier = async (req, res, next) => {
  let existingUser;
  try {
    existingUser = await ouvrier.find();
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ ouvrier: existingUser });
};

const updateouvrier = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { name, email, tel, adresse } = req.body;
  const password = generator.generate({
    length: 10,
    uppercase: false,
  });
  const id = req.params.id;
  let existingUser;
  try {
    existingUser = await ouvrier.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingUser.name = name;
  existingUser.email = email;
  existingUser.tel = tel;
  existingUser.adresse = adresse;
  existingUser.password = password;

  try {
    existingUser.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  let mailOptions = {
    from: "ismaahenaayaachi@gmail.com", // TODO: email sender
    to: email, // TODO: email receiver
    subject: "Confirmation de creation de compte ouvrier",
    text: "Votre Mot de passe est: " + password,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return log("Error occurs");
    }
    return log("Email sent!!!");
  });

  res.status(200).json({ ouvrier: existingUser });
};

const deleteouvrier = async (req, res, next) => {
  const id = req.params.id;
  let existingUser;

  try {
    existingUser = await ouvrier.findById(id);
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

const getouvrierById = async (req, res, next) => {
  const id = req.params.id;
  let existingUser;
  try {
    existingUser = await ouvrier.findById(id);
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ ouvrier: existingUser });
};

exports.signup = signup;
exports.login = login;
exports.getouvrier = getouvrier;
exports.updateouvrier = updateouvrier;
exports.deleteouvrier = deleteouvrier;
exports.getouvrierById = getouvrierById;
