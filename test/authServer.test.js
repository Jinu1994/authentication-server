const expect=require('expect');
const request=require('supertest');
const {ObjectId} = require('mongodb')

const {app}=require('./../authServer.js');
const {User}=require('./../models/user');
const users=[{
    _id:new ObjectId(),
    name:"Jacob",
    competitionId:445,
    teamName:"Liverpool FC",
    login:{
        userName:"jcb567",
        password:"jcb_789"
    }
    },{
     _id:new ObjectId(),
    name:"James",
    competitionId:445,
    teamName:"Manchester City FC",
    login:{
        userName:"jam234",
        password:"jam_567"
    }
    }];
const newUser={
    name:"Jinu",
    competitionId:445,
    teamName:"Arsenal FC",
    login:{
        userName:"jinu13",
        password:"jinu123"
    }
};

beforeEach((done)=>{
    User.remove({name:{$in:["Jinu","James","Jacob"]}}).then(()=>{
        User.insertMany(users);
        }).then(()=>done());
});
describe('POST/user',()=>{
    it('should create a new user',(done)=>{
        
    
        request(app)
        .post('/user')
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
            .post('/user')
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

