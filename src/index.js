const express=require('express');
const dotenv=require('dotenv')
dotenv.config({path:'./config.env'})
require('./db/mongoose');

// const User=require('./models/user');
// const Task=require("./models/task");

const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')

const app=express();

const port= process.env.PORT||3000;

//uploading file
const multer=require('multer')

const upload=multer({
    dest:'images',
    limits:{
        fileSize:1000000, //it is 5mb

    },

    fileFilter(req,file,cb){
        
        if(!file.originalname.match(/\.(doc|docx)$/)){
            
            return cb(new Error('Please upload a word document'))
            
        }
   
   
        //    if(!file.originalname.endsWith('.pdf')){
    //         return cb(new Error('Please upload a pdf'))
    //    }

        cb(undefined,true)
        // cb(new Error('File must be PDF'))
        // cb(undefined,true)
        // cb(undefined,false)
    }
})

// const errorMiddleware=(req,res,next)=>{
//     throw new Error('From my middleware');
// }

app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
});

// app.use((req,res,next)=>{
//     console.log(req.method,req.path);
    
//     if(req.method==='GET'){
//         res.send('GET requests are disabled')
//     }else{
//             next();
//     }

// })

// app.use((req,res,next)=>{

//     res.status(503).send('The site is undder maintainence')
// })


//parsing incoming json
//it will parse incoming object to an json
app.use(express.json());

app.use(userRouter)

app.use(taskRouter)

// const router=new express.Router();

// router.get('/test',(req,res)=>{
//     res.send("This is from my other router");
// })

// app.use(router);



app.listen(port,()=>{
    console.log('Server is up on port '+port)
});

// const jwt=require('jsonwebtoken');
// const bcrypt=require('bcryptjs');
// const myFunction=async()=>{ 
    // const password="Red12345!"
    // const hashedPassword=await bcrypt.hash(password,8);

    // console.log(password);
    // console.log(hashedPassword)

    // const isMatch=await bcrypt.compare('Red12345!',hashedPassword);

    // console.log(isMatch)

    // const token=jwt.sign({_id:'abc123'},'thisismynewcourse',{expiresIn:'7 days'})
    // console.log('token:',token);

    // const data=jwt.verify(token,'thisismynewcourse')
    // console.log(data)

// }

// myFunction()

// const pet={
//     name:'Hal'
// }

// pet.toJSON=function(){
//     return {}
// }
// console.log(JSON.stringify(pet));


const Task=require('./models/task')
const User=require('./models/user')
const main=async ()=>{

// const task=await Task.findById('600b06b8599ca8279c80012d');    
//     await task.populate('owner').execPopulate()
// console.log(task.owner)


// const user=await User.findById('600b0596670c1c1d14fdff52')
// await user.populate('tasks').execPopulate();
// console.log(user.tasks);
}

// main()