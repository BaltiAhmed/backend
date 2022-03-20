const httpError = require("../models/error");

const magasinier = require("../models/magasinier");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");
const generator = require("generate-password");

const nodemailer = require("nodemailer");
const log = console.log;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL || "darragino1@gmail.com", // TODO: your gmail account
    pass: process.env.PASSWORD || "tarajidawla1919", // TODO: your gmail password
  },
});

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { cin,name, email, tel, adresse } = req.body;
  const password = generator.generate({
    length: 10,
    uppercase: false,
  });
  let existinguser;
  try {
    existinguser = await magasinier.findOne({ email: email });
  } catch (err) {
    const error = new httpError("problems!!!", 500);
    return next(error);
  }

  let existinguserCin;
  try {
    existinguserCin = await magasinier.findOne({ cin: cin });
  } catch (err) {
    const error = new httpError("problems!!!", 500);
    return next(error);
  }

  if (existinguser || existinguserCin) {
    const error = new httpError("user exist", 422);
    return next(error);
  }

  const createduser = new magasinier({
    name,
    cin,
    email,
    password,
    tel,
    adresse,
    commandeExterne:[],
    commandeInterne:[]
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
    subject: "Confirmation de creation de compte magasinier",
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
    MagasinierId: createduser.id,
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
    existingUser = await magasinier.findOne({ email: email });
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
  res.status(200).json({ Magasinier: existingUser, token: token });
};

const getmagasinier = async (req, res, next) => {
  let existingUser;
  try {
    existingUser = await magasinier.find();
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ existingUserUser: existingUser });
};

const updatemagasinier = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { cin,name, email, tel, adresse } = req.body;
  const password = generator.generate({
    length: 10,
    uppercase: false,
  });
  const id = req.params.id;
  let existingUser;
  try {
    existingUser = await magasinier.findById(id);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingUser.cin = cin;
  existingUser.name = name;
  existingUser.email = email;
  existingUser.password = password;
  existingUser.adresse = adresse;
  existingUser.tel = tel;

  try {
    existingUser.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  let mailOptions = {
    from: "ismaahenaayaachi@gmail.com", // TODO: email sender
    to: email, // TODO: email receiver
    subject: "Confirmation de creation de compte magasinier",
    text: "Votre Mot de passe est: " + password,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return log("Error occurs");
    }
    return log("Email sent!!!");
  });

  res.status(200).json({ magasinier: existingUser });
};

const deletemagasinier = async (req, res, next) => {
  const id = req.params.id;
  let existingUser;

  try {
    existingUser = await magasinier.findById(id);
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

const getmagasinierById = async (req, res, next) => {
  const id = req.params.id;
  let existingUser;
  try {
    existingUser = await magasinier.findById(id);
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ existingUser: existingUser });
};

exports.signup = signup;
exports.login = login;
exports.getmagasinier = getmagasinier;
exports.updatemagasinier = updatemagasinier;
exports.deletemagasinier = deletemagasinier;
exports.getmagasinierById = getmagasinierById;
