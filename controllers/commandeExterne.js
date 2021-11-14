const httpError = require("../models/error");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const commandeExterne = require("../models/commandeExterne");
const fournisseur = require("../models/fournisseur");
const magasinier = require("../models/magasinier");

const ajoutcommandeExterne = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { prix, founisseurId, magasinierId } = req.body;

  let existingmagasinier;

  try {
    existingmagasinier = await magasinier.findById(magasinierId);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  let existingFouniseur;

  try {
    existingFouniseur = await fournisseur.findById(founisseurId);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  const d = new Date();

  const createdCommandeExterne = new commandeExterne({
    date: d,
    prix,
    produits: [],
    founisseurId,
    magasinierId,
  });

  try {
    createdCommandeExterne.save();
    existingmagasinier.commandeExterne.push(createdCommandeExterne);
    existingmagasinier.save();
  } catch (err) {
    const error = new httpError("failed signup !!!!", 500);
    return next(error);
  }
  res.status(201).json({
    commandeExterne: createdCommandeExterne,
  });
};

const getcommandeExterne = async (req, res, next) => {
  let existingCommandeExterne;
  try {
    existingCommandeExterne = await commandeExterne.find();
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ existingCommandeExterne: existingCommandeExterne });
};

const updatecommandeExterne = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { idMagasinier, idProduit, idFournisseur } = req.body;
  const userId = req.params.userId;
  let existingUser;
  try {
    existingUser = await commandeExterne.findById(userId);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  console.log(existingUser);
  console.log(idProduit);
  console.log(idFournisseur);
  console.log(idMagasinier);

  existingUser.idProduit = idProduit;
  existingUser.idOuvrier = idMagasinier;
  existingUser.idOuvrier = idFournisseur;

  try {
    existingUser.save();
  } catch {
    const error = new httpError("failed to patch", 500);
    return next(error);
  }

  res.status(200).json({ existingUser: existingUser });
};

const deletecommandeExterne = async (req, res, next) => {
  const id = req.params.id;
  let existingUser;

  try {
    existingUser = await commandeExterne.findById(id);
  } catch {
    return next(new httpError("failed !!", 500));
  }
  if (!existingUser) {
    return next(new httpError("commande does not exist !!", 500));
  }
  try {
    existingUser.remove();
  } catch {
    return next(new httpError("failed !!!", 500));
  }
  res.status(200).json({ message: "deleted" });
};

const getcommandeExterneById = async (req, res, next) => {
  const userId = req.params.id;
  let existingUser;
  try {
    existingUser = await commandeExterne.findById(userId);
  } catch {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.json({ commandeExterne: existingUser });
};

exports.ajoutcommandeExterne = ajoutcommandeExterne;
exports.getcommandeExterne = getcommandeExterne;
exports.updatecommandeExterne = updatecommandeExterne;
exports.deletecommandeExterne = deletecommandeExterne;
exports.getcommandeExterneById = getcommandeExterneById;
