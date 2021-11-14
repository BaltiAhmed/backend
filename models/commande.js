const mongoose =require("mongoose")
const schema = mongoose.Schema;

const commandeSchema = new schema({

    date:{type:String,required:true},
    idProduit:{type:String,required:true},
    idOuvrier:{type:String,required:true},
    finished:{type:Boolean,required:true},
    

})



module.exports = mongoose.model('commande',commandeSchema)