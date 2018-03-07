const {mongooseDbClient}=require('./mongooseDbClient.js');
const {User}=require('./models/user.js');

const express=require('express');
const bodyParser=require('body-parser');
const app=express();

app.use(bodyParser.json());

app.post('/user',(request,response)=>{
        console.log(request.body);
        var user=new User();
        Object.assign(user,request.body);
        user.save().then((savedUser)=>{
            response.send(savedUser);
        },(error)=>{
            response.status(400).send(e);
        });
});

app.get('/users',(request,response)=>{
   User.find({}).then((users)=>response.status(200).send({users}),(error)=>response.status(400).send(error));
});

app.listen(3000,()=>{
    console.log('Server running on Port: 3000');
});

module.exports={app};