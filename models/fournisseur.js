const mongoose =require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const schema = mongoose.Schema;

const fournisseurSchema = new schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    tel:{type:String,required:true},
    adresse:{type:String,required:true}
    
})

fournisseurSchema.plugin(uniqueValidator)

module.exports = mongoose.model('fournisseur',fournisseurSchema)