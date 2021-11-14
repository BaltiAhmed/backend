const mongoose =require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const schema = mongoose.Schema;

const ouvrierSchema = new schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlenght:8},
    tel:{type:String,required:true},
    adresse:{type:String,required:true},
    commande:[{type:mongoose.Types.ObjectId,required:true,ref:'commande'}],
    pointage:[{type:mongoose.Types.ObjectId,required:true,ref:'pointage'}]

})

ouvrierSchema.plugin(uniqueValidator)

module.exports = mongoose.model('ouvrier',ouvrierSchema)