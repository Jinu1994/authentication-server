
const {ObjectID} = require('mongodb')
const jwt=require('jsonwebtoken');

const {User}=require('../models/user');

const userOneId=new ObjectID();
const userTwoId=new ObjectID();
const userThreeId=new ObjectID();

const users=[{
    _id: userOneId,
    name:"Jinu",
    competitionId:445,
    teamName:"Arsenal FC",
    email:"jinu.tg13@gmail.com",
    userName:"jinu13",
    password:"jinu123",
    tokens:[{
        access:'auth',
        token:jwt.sign({_id:userOneId,access:'auth'},'abc123').toString()
    }]
    },{
     _id: userTwoId,
    name:"James",
    competitionId:445,
    teamName:"Manchester City FC",
    email:"james45@gmail.com",
    userName:"jm@sf",
    password:"jms_123",
    tokens:[{
        access:'auth',
        token:jwt.sign({_id:userTwoId,access:'auth'},'abc123').toString()
    }]
    }];
const newUser={
    _id: userThreeId,
    name:"Jacob",
    competitionId:445,
    teamName:"Chelsea FC",
    email:"jcb_123@gmail.com",
    userName:"jcb567",
    password:"jcb_789",
    tokens:[{
        access:'auth',
        token:jwt.sign({_id:userThreeId,access:'auth'},'abc123').toString()
    }]
};


const populateUsers=(done)=>{
    User.remove({}).then(()=>{
      var userOne=new User(users[0]).save();
      var userTwo=new User(users[1]).save();
        
        return Promise.all([userOne,userTwo]);
    }).then(()=>done())
    .catch((error)=>console.log(error));
}

module.exports={newUser,users,populateUsers};