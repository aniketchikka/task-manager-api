const mongoose=require('mongoose');
const connectionURL='mongodb://127.0.0.1:27017'
const databaseName='task-manager'

mongoose.connect(process.env.PRODUCTION_DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD),{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
});



// const task=new Task({
//     description:"    Eat Lunch"
// })

// task.save().then(()=>{
//     console.log(task);
// }).catch((error)=>{
//     console.log(error);
// })

