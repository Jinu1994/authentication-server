const mongoose=require('mongoose');

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
    email:{
            type:String,
            required:true,
            trim:true,
            unique:true
        },
    password:{
        type:String,
        minlength:5,
        required:true
    },
    userName:{
        type:String,
        minlength:5,
        required:true
    }
});

module.exports={User};