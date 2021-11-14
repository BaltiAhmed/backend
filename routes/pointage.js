const express = require("express");
const route = express.Router();

const pointageControllers = require("../controllers/pointage");

const { check } = require("express-validator");

route.post(
  "/ajout",
  check("idOuvrier").not().isEmpty(),
  check("type").not().isEmpty(),
  check("date").not().isEmpty(),
  check("heure").not().isEmpty(),
  pointageControllers.ajout
);

route.get('/ouvrier/:id',pointageControllers.getPointageByOuvrierId)

module.exports = route;
