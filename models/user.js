const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const _=require('lodash');
const bcrypt=require('bcryptjs');

Schema=mongoose.Schema;


var UserSchema=new Schema({
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
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

UserSchema.methods.toJSON=function(){
    var userObject=this.toObject();
    return _.pick(userObject,['_id','email']);
}

UserSchema.methods.generateAuthToken=function() {
    var user=this;
    var access="access";
    try{
    var token = jwt.sign({_id: user._id.toHexString(),access},'abc123').toString();
    user.tokens.push({
        access,
        token
    });
}catch(error){
    console.log(error);
}
   return  user.save().then(()=>{
        return token;
    });
}

UserSchema.statics.findByToken=function(token){
    var User=this;
    var decoded;
    try{
     decoded=jwt.verify(token,'abc123');
    }catch(error){
        return Promise.reject();
    }
   return User.findOne({
        _id:decoded._id,
        'tokens.token':token,
        'tokens.access':'access'
    });
}

UserSchema.pre('save',function(next){
    var user=this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(error,salt)=>{
            bcrypt.hash(user.password,salt,(error,hash)=>{
                user.password=hash;
                next();
            });

        });
    }else{
        next();
    }
});

var User=mongoose.model('User',UserSchema);
module.exports={User};