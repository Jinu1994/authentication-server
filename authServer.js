const {mongooseDbClient}=require('./mongooseDbClient.js');
const {User}=require('./models/user.js');

const express=require('express');
const bodyParser=require('body-parser');
const app=express();
const {ObjectId}=require('mongodb')
const port=process.env.PORT||3000;
app.use(bodyParser.json());

app.post('/users',(request,response)=>{
        console.log(request.body);
        var user=new User();
        Object.assign(user,request.body);
        user.save().then((savedUser)=>{
            response.send(savedUser);
        },(error)=>{
            response.status(400).send(error);
        });
});

app.get('/users',(request,response)=>{
   User.find({}).then((users)=>{
       console.log(users);
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
                response.status(404)
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
                    response.status(404).send(`User with Id: ${userId} not found`);
                else    
                    response.status(200).send(`User has been deleted`);
            });
        }
});

app.listen(port,()=>{
    console.log(`Server running on Port: ${port}`);
});

module.exports={app};