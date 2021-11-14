const httpError = require("../models/error");

const { validationResult } = require("express-validator");

const produit = require("../models/produit");
const magasinier = require("../models/magasinier");

const ajoutProduit = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const {
    name,
    categorie,
    poidsNet,
    dateFb,
    quantite,
    founisseur,
    idMagasinier,
  } = req.body;

  let existingmagasinier;

  try {
    existingmagasinier = await magasinier.findById(idMagasinier);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  const createdProduit = new produit({
    name,
    categorie,
    poidsNet,
    dateFb,
    quantite,
    founisseur,
  });

  try {
    await createdProduit.save();
    existingmagasinier.produits.push(createdProduit);
    await existingmagasinier.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.status(201).json({
    produit: createdProduit,
  });
};

const getproduit = async (req, res, next) => {
  let existingProduit;
  try {
    existingProduit = await produit.find();
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ existingProduit: existingProduit });
};

const updateproduit = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { name, categorie, poidsNet, dateFb, quantite, founisseur } = req.body;
  const userId = req.params.id;
  let existingUser;
  try {
    existingUser = await produit.findById(userId);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  existingUser.name = name;
  existingUser.categorie = categorie;
  existingUser.poidsNet = poidsNet;
  existingUser.dateFb = dateFb;
  existingUser.quantite = quantite;
  existingUser.founisseur = founisseur;
  try {
    existingUser.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ existingUser: existingUser });
};

const deleteproduit = async (req, res, next) => {
  const id = req.params.id;
  let existingUser;

  try {
    existingUser = await produit.findById(id);
  } catch {
    return next(new httpError("failed !!", 500));
  }
  if (!existingUser) {
    return next(new httpError("produit does not exist !!", 500));
  }
  try {
    existingUser.remove();
  } catch {
    return next(new httpError("failed !!!", 500));
  }
  res.status(200).json({ message: "deleted" });
};

const getproduitById = async (req, res, next) => {
  const id = req.params.id;
  let existingUser;
  try {
    existingUser = await produit.findById(id);
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ produit: existingUser });
};

exports.ajoutProduit = ajoutProduit;
exports.getproduit = getproduit;
exports.updateproduit = updateproduit;
exports.deleteproduit = deleteproduit;
exports.getproduitById = getproduitById;
