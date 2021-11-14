const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const responsableRoute = require("./routes/responsable");

const magasinierRoute = require("./routes/magasinier");

const fournisseurRoutes = require("./routes/fournisseur");

const ouvrierRoutes = require("./routes/ouvrier");

const commandeRoutes = require("./routes/commande");

const commandeExterneRoutes = require("./routes/commandeExterne");

const produitExterne = require("./routes/produit-externe");

const produitRoute = require("./routes/produit");
const pointageRoute = require("./routes/pointage");
const categorieRoute = require("./routes/categorie");

const httperror = require("./models/error");

const mongoose = require("mongoose");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/responsable", responsableRoute);
app.use("/api/magasinier", magasinierRoute);
app.use("/api/fournisseur", fournisseurRoutes);
app.use("/api/ouvrier", ouvrierRoutes);
app.use("/api/commande", commandeRoutes);
app.use("/api/produit", produitRoute);
app.use("/api/commandeExterne", commandeExterneRoutes);
app.use("/api/produitExterne", produitExterne);
app.use("/api/pointage", pointageRoute);
app.use("/api/categorie", categorieRoute);

app.use((req, res, next) => {
  const error = new httperror("could not find that page", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "an unknown error occurred " });
});

mongoose
  .connect(
    "mongodb+srv://ismahen:admin@cluster0.mdgn9.mongodb.net/GestionStock?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
