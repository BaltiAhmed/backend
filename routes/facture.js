const express = require("express");
const route = express.Router();

const factureControllers = require("../controllers/facture");

const { check } = require("express-validator");




route.get('/:getfacture',factureControllers.getfacture)

module.exports = route;