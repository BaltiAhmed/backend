const httpError = require("../models/error");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");
const commande = require("../models/facture");

const ajoutfacture = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { name, date } = req.body;
};
const getfacture = async (req, res, next) => {
  let existingUser;
  try {
    existingUser = await user.find({}, "-password");
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ existingUser: existingUser });
};
const getfactureById = async (req, res, next) => {
  const userId = req.params.id;
  let existingUser;
  try {
    existingUser = await facture.findById(userId);
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ facture: existingUser });
};
exports.ajoutfacture = ajoutfacture;
exports.getfacture = getfacture;
exports.getfactureById = getfactureById;
