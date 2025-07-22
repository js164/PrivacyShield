const mongoose=require('mongoose')

const AdminUser= new mongoose.Schema({
    userId:{
        type: String,
        require:true
    },
    password:{
        type:String,
        require:true,
    },
    verificationToken:{
        type: String,
    },
    verificationTokenExpiresAt:{
        type : Date
    },
    createdAt:{
        type: Date,
        default:Date.now
    }
})

const User=mongoose.model('adminUser',AdminUser)
User.createIndexes()
module.exports=User