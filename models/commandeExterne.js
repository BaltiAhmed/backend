const mongoose = require("mongoose");
const schema = mongoose.Schema;

const commandeExterneSchema = new schema({
  date: { type: String, required: true },
  prix: { type: String, required: true },
  produits: [
    { type: mongoose.Types.ObjectId, required: true, ref: "produitExterne" },
  ],
  founisseurId: { type: String, required: true },
  magasinierId: { type: String, required: true },
});

module.exports = mongoose.model("commandeExterne", commandeExterneSchema);
