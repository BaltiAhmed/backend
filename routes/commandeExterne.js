const express = require("express");
const route = express.Router();

const commandeExterneControllers = require("../controllers/commandeExterne");

const { check } = require("express-validator");


route.post('/ajout',commandeExterneControllers.ajoutcommandeExterne)

route.delete('/:id',commandeExterneControllers.deletecommandeExterne)
route.patch('/:id',commandeExterneControllers.updatecommandeExterne)
route.get('/',commandeExterneControllers.getcommandeExterne)

module.exports = route;