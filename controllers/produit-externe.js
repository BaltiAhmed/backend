const httpError = require("../models/error");

const { validationResult } = require("express-validator");

const produitExterne = require("../models/produit-externe");

const commandeExterne = require("../models/commandeExterne");

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
    prix,
    commandeExterneId,
  } = req.body;

  let existingCommandeExterne;

  try {
    existingCommandeExterne = await commandeExterne.findById(commandeExterneId);
  } catch {
    const error = new httpError("problem", 500);
    return next(error);
  }

  const createdProduit = new produitExterne({
    name,
    categorie,
    poidsNet,
    dateFb,
    quantite,
    prix,
  });

  try {
    await createdProduit.save();
    existingCommandeExterne.produits.push(createdProduit);
    await existingCommandeExterne.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.status(201).json({
    produit: createdProduit,
  });
};

const getProduitByFactureId = async (req, res, next) => {
  const id = req.params.id;

  let existingProduit;
  try {
    existingProduit = await commandeExterne.findById(id).populate("produits");
  } catch (err) {
    const error = new httpError("Fetching failed", 500);
    return next(error);
  }

  if (!existingProduit || existingProduit.produits.length === 0) {
    return next(new httpError("could not find parents for this id.", 404));
  }

  res.json({
    existingProduit: existingProduit.produits.map((item) =>
      item.toObject({ getters: true })
    ),
  });
};


exports.ajoutProduit = ajoutProduit
exports.getProduitByFactureId = getProduitByFactureId
