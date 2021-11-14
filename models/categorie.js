const mongoose = require("mongoose");
const schema = mongoose.Schema;

const categorieSchema = new schema({
  nom: { type: String, required: true },
});

module.exports = mongoose.model("categorie", categorieSchema);
