const mongoose=require('mongoose');
const Schema=mongoose.Schema;

var Login=new Schema({
    userName:{
        type:String,
        minlength:1,
        required:true,
        trim:true
    },
    password:{
        type:String,
        minlength:5,
        required:true
    }
});

module.exports={Login};