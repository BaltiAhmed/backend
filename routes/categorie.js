const express = require("express");
const route = express.Router();

const categorieControllers = require("../controllers/categorie");

const { check } = require("express-validator");

route.get("/", categorieControllers.getCategorie);
route.delete("/:id", categorieControllers.deleteCategorie);
route.post(
  "/ajout",
  check("nom").not().isEmpty(),
  categorieControllers.ajoutCategorie
);

module.exports = route;
