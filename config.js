var env=process.env.NODE_ENV || 'development';
console.log(env);
if(env==='development'){
    process.env.PORT=3000;
    process.env.MONGODB_URI='mongodb://localhost:27017/soccer-fever';
} else if (env==='test') {
    process.env.PORT=3000;
    process.env.MONGODB_URI='mongodb://localhost:27017/soccer-fever-test';
    console.log(process.env.PORT);
} else if (env==='production'){
    process.env.MONGODB_URI='mongodb://jinug:jinu123@ds161148.mlab.com:61148/soccer-fever';
}
