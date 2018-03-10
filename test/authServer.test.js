const expect=require('expect');
const request=require('supertest');
const {ObjectId} = require('mongodb')

const {app}=require('./../authServer.js');
const {User}=require('./../models/user');
const users=[{
    _id:'5aa3f46ff0ed5916140912a7',
    name:"Jacob",
    competitionId:445,
    teamName:"Chelsea FC",
    login:{
        _id:"5aa41a02cf57062e348d97ee",
        userName:"jcb567",
        password:"jcb_789"
    }
    },{
     _id:'5aa428fe8816ff4728443907',
    name:"James",
    competitionId:445,
    teamName:"Manchester City FC",
    login:{
        userName:"jam234",
        password:"jam_567"
    }
    }];
const newUser={
    _id:"5aa429348816ff4728443908",
    name:"Jinu",
    competitionId:445,
    teamName:"Arsenal FC",
    login:{
        userName:"jinu13",
        password:"jinu123"
    }
};

const userUpdateInfo={
    "name":"Jacob Daniels",
    "competitionId":446,
    "teamName":"Liverpool FC"
};
const updatedUser={
    "_id": "5aa3f46ff0ed5916140912a7",
    "name": "Jacob Daniels",
    "competitionId": 446,
    "teamName": "Liverpool FC",
    "login": {
        "_id": "5aa41a02cf57062e348d97ee",
        "userName": "jcb567",
        "password": "jcb_789"
    },
    "__v": 0
};
beforeEach((done)=>{
    User.remove({_id:{$in:["5aa428fe8816ff4728443907","5aa429348816ff4728443908","5aa3f46ff0ed5916140912a7"]}}).then(()=>{
        User.insertMany(users);
        }).then(()=>done());
});
describe('POST/users',()=>{
    it('should create a new user',(done)=>{
        
    
        request(app)
        .post('/users')
        .send(newUser)
        .expect(200)
        .expect((response)=>{
            var returnedUser=response.body;
            expect(returnedUser.name).toEqual(newUser.name);
        })
        .end((error,response)=>{
            if(error){
                return done(error);
            }

            User.find({name:"Jinu"}).then((returnedUsers)=>{
                expect(returnedUsers.length).toBe(1);
                expect(returnedUsers[0].name).toEqual(newUser.name);
                done();
            }).catch((e)=>done(e));

        });
    });

    it('should not create a new user',(done)=>{
            request(app)
            .post('/users')
            .send({})
            .expect(400)
            .end((error,response)=>{
                    if(error)
                        return  done(error);
            });
            User.find({name:"Jinu"}).then((returnedUsers)=>{
                expect(returnedUsers.length).toBe(0);
                done();
            });
        });
});


describe('GET/Users',()=>{
    it('should get all users',(done)=>{
    request(app)
    .get(`/users`)
    .expect(200)
    .expect((response)=>{
        var returnedUsers=response.body.users;
        expect(returnedUsers.length).toBe(2);
    })
    .end(done);
    });
});

describe('GET/Users/:id',()=>{
    it('should get user with the given id',(done)=>{
    request(app)
    .get(`/users/${users[0]._id}`)
    .expect(200)
    .expect((response)=>{
        var user=response.body.user;
        expect(user.name).toBe(users[0].name);
    })
    .end(done);
    });

    it('should return 404 if user not found',(done)=>{
        var userId=new ObjectId().toHexString();
        request(app)
        .get(`/users/${userId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if user it is invalid',(done)=>{
        request(app)
        .get(`/users/1234dsfs`)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /Users/:id',()=>{
    it("should delete the user",(done)=>{
        request(app)
        .delete('/users/5aa3f46ff0ed5916140912a7')
        .expect(200)
        .end((error,response)=>{
            if(error)
                done(error);
           User.findById('5aa3f46ff0ed5916140912a7')
                .then((deletedUser)=>{
                        expect(deletedUser).toNotExist;
                        done();
                });
        });
    });
    it('should return 404 if user not found',(done)=>{
        var userId=new ObjectId().toHexString();
        request(app)
        .delete(`/users/${userId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if user it is invalid',(done)=>{
        request(app)
        .delete(`/users/1234dsfs`)
        .expect(404)
        .end(done);
    });
});

describe('PATCH /users/:id',()=>{
    it("should update the user",(done)=>{
        request(app)
        .patch(`/users/5aa3f46ff0ed5916140912a7`)
        .send(userUpdateInfo)
        .expect(200)
        .expect((response)=>{
                var updatedUserResponse=response.body.user;
                expect(updatedUserResponse).toEqual(updatedUser);
        })
        .end((error,response)=>{
                if(error)
                  return  done(error);
             User.findById('5aa3f46ff0ed5916140912a7').then((updatedUserInDb)=>{
                 expect(updatedUserInDb.name).toEqual(userUpdateInfo.name);
                 expect(updatedUserInDb.competitionId).toEqual(userUpdateInfo.competitionId);
                 expect(updatedUserInDb.teamName).toEqual(userUpdateInfo.teamName);
                 done();
             }).catch((error)=>{
                 done(error);
             });
        }); 
    });

    it('should return 404 if user not found',(done)=>{
        var userId=new ObjectId().toHexString();
        request(app)
        .patch(`/users/${userId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if user it is invalid',(done)=>{
        request(app)
        .patch(`/users/1234dsfs`)
        .expect(404)
        .end(done);
    });
});

