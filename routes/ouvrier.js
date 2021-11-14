const express = require("express");
const route = express.Router();

const ouvrierControllers = require("../controllers/ouvrier");

const { check } = require("express-validator");

route.post(
  "/signup",
  check("name").not().isEmpty(),
  check("tel").not().isEmpty(),
  check("adresse").not().isEmpty(),
  check("email").normalizeEmail(),
  ouvrierControllers.signup
);

route.post(
  "/login",
  check("email").normalizeEmail(),
  check("password").isLength({ min: 8 }),
  ouvrierControllers.login
);

route.get("/", ouvrierControllers.getouvrier);

route.patch(
  "/:id",
  check("name").not().isEmpty(),
  check("tel").not().isEmpty(),
  check("adresse").not().isEmpty(),
  check("email").normalizeEmail(),
  ouvrierControllers.updateouvrier
);

route.delete("/:id", ouvrierControllers.deleteouvrier);

route.get("/:id", ouvrierControllers.getouvrierById);

module.exports = route;
