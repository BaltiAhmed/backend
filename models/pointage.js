const mongoose =require("mongoose")
const schema = mongoose.Schema;

const pointageSchema = new schema({
    idOuvrier:{type:String,required:true},
    date:{type:String,required:true},
    heure:{type:String,required:true},
    type:{type:String,required:true},

})

module.exports = mongoose.model('pointage',pointageSchema)