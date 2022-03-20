const mongoose =require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const schema = mongoose.Schema;

const magasinierSchema = new schema({
    name:{type:String,required:true},
    cin:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlenght:8},
    tel:{type:String,required:true},
    adresse:{type:String,required:true},
    commandeExterne:[{type:mongoose.Types.ObjectId,required:true,ref:'commandeExterne'}],
    commandeInterne:[{type:mongoose.Types.ObjectId,required:true,ref:'commande'}]

})

magasinierSchema.plugin(uniqueValidator)

module.exports = mongoose.model('magasinier',magasinierSchema)