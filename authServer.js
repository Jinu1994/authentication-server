require('./config');

const {mongooseDbClient}=require('./mongooseDbClient.js');
const {User}=require('./models/user.js');
const _ =  require('lodash');
const {authenticate}=require('./authenticate')

const express=require('express');
const bodyParser=require('body-parser');
const app=express();
const {ObjectId}=require('mongodb')
const port=process.env.PORT;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
app.use(bodyParser.json());

app.post('/users',(request,response)=>{
        var user=new User();
        Object.assign(user,request.body.newUser);

        user.save().then(()=>{
            return user.generateAuthToken();
        }).then((token)=>{
            response.setHeader('access-control-expose-headers','X-Auth');
            response.setHeader('X-Auth',token);
            response.status(200).send(user);
        }).catch((error)=>{
            response.status(400).send(error);
        });
});

app.get('/users',(request,response)=>{
   User.find({}).then((users)=>{
       response.status(200).send({users}),(error)=>response.status(400).send(error)});
});

app.get('/users/:id',(request,response)=>{
    var userId=request.params.id;
    if(!ObjectId.isValid(userId))
        response.status(404).send(`UserId: ${userId} is invalid`);
    else {
        User.findById(userId)
            .then((user)=>{
            if(!user)
             return  response.status(404)
                        .send(`User with id ${userId} not found`);
            else
                response.status(200).send({user})
            });
    }
});


app.delete('/users/:id',(request,response)=>{
        var userId=request.params.id;
        if(!ObjectId.isValid(userId))
            response.status(404).send(`UserId: ${userId} is invalid`);
        else{
            User.findByIdAndRemove(userId).then((user)=>{
                if(!user)
                  return  response.status(404).send(`User with Id: ${userId} not found`);
                else    
                    response.status(200).send(`User has been deleted`);
            });
        }
});

app.patch('/users/:id',(request,response)=>{
    var userId=request.params.id;
    var body=_.pick(request.body,['name','competitionId','teamName','login']);
    if(!ObjectId.isValid(userId))
            response.status(404).send(`UserId: ${userId} is invalid`);
    else{
        User.findByIdAndUpdate(userId,{$set:body},{new:true}).then((updatedUser)=>{
            if(!updatedUser)
              return  response.status(404).send("Update failed");
            response.status(200).send({user:updatedUser});
        }).catch((error)=>response.status(400).send(error));
    }
});

app.listen(port,()=>{
    console.log(`Server running on Port: ${port}`);
});

module.exports={app};