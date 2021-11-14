const mongoose =require("mongoose")
const schema = mongoose.Schema;

const factureSchema = new schema({

  
    id:{type:String,required:true},
    num:{type:String,required:true},
    date:{type:String,required:true},
    

})



module.exports = mongoose.model('facture',factureSchema)