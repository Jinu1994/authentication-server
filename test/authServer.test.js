const expect=require('expect');
const request=require('supertest');

const {app}=require('./../authServer.js');
const {User}=require('./../models/user');
const users=[{
    name:"Jacob",
    competitionId:445,
    teamName:"Liverpool FC",
    login:{
        userName:"jcb567",
        password:"jcb_789"
    }
    },{
    name:"James",
    competitionId:445,
    teamName:"Manchester City FC",
    login:{
        userName:"jam234",
        password:"jam_567"
    }
    }];
beforeEach((done)=>{
    User.remove({name:{$in:["Jinu","James","Jacob"]}}).then(()=>{
        User.insertMany(users);
        }).then(()=>done());
});
describe('POST/user',()=>{
    it('should create a new user',(done)=>{
        var user={
            name:"Jinu",
            competitionId:445,
            teamName:"Arsenal FC",
            login:{
                userName:"jinu13",
                password:"jinu123"
            }
        };
    
        request(app)
        .post('/user')
        .send(user)
        .expect(200)
        .expect((response)=>{
            var returnedUser=response.body;
            expect(returnedUser.name).toEqual(user.name);
        })
        .end((error,response)=>{
            if(error){
                return done(error);
            }

            User.find({name:"Jinu"}).then((users)=>{
                expect(users.length).toBe(1);
                expect(users[0].name).toEqual(user.name);
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
            User.find({name:"Jinu"}).then((users)=>{
                expect(users.length).toBe(0);
                done();
            });
        });
});


describe('GET/Users',()=>{
    it('should get all users',(done)=>{
    request(app)
    .get('/users')
    .expect(200)
    .expect((response)=>{
        var users=response.body.users;
        expect(users.length).toBe(2);
    })
    .end(done);
    });
});