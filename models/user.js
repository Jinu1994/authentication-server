const mongoose=require('mongoose');
const {Login}=require('./login.js');

Schema=mongoose.Schema;
ObjectId=mongoose.Schema.Types.ObjectId;


var User=mongoose.model('User',{
    name:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    competitionId:{
        type:Number,
        required:true
    },
    teamName:{
        type:String,
        required:true,
        trim:true,
        minlength:1
    },
    login:Login
});

module.exports={User};