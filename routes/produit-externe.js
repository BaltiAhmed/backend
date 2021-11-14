const express = require("express");
const route = express.Router();

const produitExterneController = require("../controllers/produit-externe");

const { check } = require("express-validator");

route.post('/ajout',produitExterneController.ajoutProduit)
route.get('/facture/:id',produitExterneController.getProduitByFactureId)

module.exports = route;

