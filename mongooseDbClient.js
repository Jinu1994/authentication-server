const mongoose=require('mongoose');

mongoose.Promise=global.Promise;
const localDbConnection='mongodb://localhost:27017/soccer-fever';
const mLabDbConnection='mongodb://jinug:jinu123@ds161148.mlab.com:61148/soccer-fever';
mongoose.connect(process.env.MONGODB_URI);

module.exports={mongooseDbClient:mongoose};

// module.exports.connect=()=>{
//     MongoClient.connect('mongodb://localhost:27017',(err,client)=>{
//     if(err){
//       return   console.log("Unable to Connect to mongodb server")
//     }
    
//     var db=client.db('soccer-fever');
   
//     db.collection('users').insertOne({
//         name:"jacob",
//         competitionId:445,
//         teamName:"Chelsea FC",
//         login:{userName:"jcb123",password:"j@123"}
//     },(error,result)=>{
//         if(error){
//             return console.log("Unable to insert user");
//         }
//         console.log(result.ops);
//     });
//     client.close();
    
//     });
// }