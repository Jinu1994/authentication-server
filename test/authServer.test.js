const expect=require('expect');
const request=require('supertest');
const {ObjectId} = require('mongodb')

const {app}=require('./../authServer.js');
const {User}=require('./../models/user');
const {users,newUser,populateUsers} = require('./seedData');

const userUpdateInfo={
    email:"jinu.tg14@gmail.com"
};
const updatedUser={
    _id:'5aa3f46ff0ed5916140956b7',
    name:"Jacob",
    competitionId:445,
    teamName:"Chelsea FC",
    email:"jinu.tg14@gmail.com",
    userName:"jcb567",
    password:"jcb_789"
    };

const loginInfo={
    email:"jinu.tg13@gmail.com",
    password:"jinu123"
};

beforeEach(populateUsers);


describe('POST/users',()=>{

    it('should create a new user',(done)=>{
        request(app)
        .post('/users')
        .send({newUser})
        .expect(200)
        .expect((response)=>{
               expect(response.headers['x-auth']).toExist;
               expect(response.body._id).toExist;
               expect(response.body.email).toBe(newUser.email);
        })
        .end((error,response)=>{
            if(error){
                return done(error);
            }
            User.findById(newUser._id).then((userInDb)=>{
                expect(userInDb).toExist;
                expect(userInDb.password).not.toBe(newUser.password);
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
            User.find({name:"Jacob"}).then((usersInDb)=>{
                expect(usersInDb.length).toBe(0);
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
        expect(user.email).toBe(users[0].email);
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
        .delete(`/users/${users[0]._id}`)
        .expect(200)
        .end((error,response)=>{
            if(error)
                return done(error);
           User.findById(users[0]._id)
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
        .patch(`/users/${users[0]._id}`)
        .send(userUpdateInfo)
        .expect(200)
        .expect((response)=>{
                var updatedUserResponse=response.body.user;
                expect(updatedUserResponse.email).toEqual(updatedUser.email);
        })
        .end((error,response)=>{
                if(error)
                  return  done(error);
             User.findById(users[0]._id).then((updatedUserInDb)=>{
                 expect(updatedUserInDb.email).toEqual(userUpdateInfo.email);
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


describe('POST users/login',()=>{
    it('should return the user and token',(done)=>{
        request(app)
        .post('/users/login')
        .send({login:loginInfo})
        .expect(200)
        .expect((response)=>{
                expect(response.headers['X-Auth']).toExist;
                var returnedUser=response.body;
                expect(returnedUser._id).toExist;
                expect(returnedUser.email).toEqual(users[0].email);
        })
        .end((error,response)=>{
            if(error)
                return done(error);
            
            User.findById(users[0]._id).then((userInDb)=>{
                        var tokensLength=userInDb.tokens.length;
                    expect(userInDb.tokens[tokensLength-1].token).toEqual(response.headers['x-auth']);
                    done();
            }).catch((error)=>done(error));
        });
    });
});
