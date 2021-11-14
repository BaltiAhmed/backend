const httpError = require("../models/error");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");
const categorie = require("../models/categorie");

const ajoutCategorie = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom } = req.body;

  const craetedCategorie = new categorie({
    nom,
  });

  try {
    await craetedCategorie.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.status(201).json({
    categorie: craetedCategorie,
  });
};
const getCategorie = async (req, res, next) => {
  let existingCategorie;
  try {
    existingCategorie = await categorie.find();
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ existingCategorie: existingCategorie });
};

const deleteCategorie = async (req, res, next) => {
    const id = req.params.id;
    let existingCategorie;
  
    try {
        existingCategorie = await categorie.findById(id);
    } catch {
      return next(new httpError("failed !!", 500));
    }
    if (!existingCategorie) {
      return next(new httpError("categorie does not exist !!", 500));
    }
    try {
        existingCategorie.remove();
    } catch {
      return next(new httpError("failed !!!", 500));
    }
    res.status(200).json({ message: "deleted" });
  };

exports.ajoutCategorie =ajoutCategorie
exports.getCategorie =getCategorie
exports.deleteCategorie =deleteCategorie
