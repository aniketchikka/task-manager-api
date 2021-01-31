const express=require('express');
const multer=require('multer')
const User=require('../models/user');
const router=new express.Router();
const auth=require('../middleware/auth')
const sharp=require('sharp')

//route for creating the new user
router.post('/users',async(req,res)=>{
   
    const user =new User(req.body);
    

    try{

        await user.save()
       
        const token=await user.generateAuthToken()    
       
        res.status(201).send({user,token})
        
    }
    catch(e){
        res.status(400).send(e)
    }

    // user.save().then(()=>{
    //     res.status(201).send(user)
    // }).catch((error)=>{
    //     res.status(400).send(error)
    // })
    
})

//route for logging in
router.post('/users/login',async(req,res)=>{

    
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        // res.status(200).send({user:user.getPublicProfile(),token});
        res.status(200).send({user,token});
    }catch(e){
        res.status(400).send();
    }
})

//route for logging out
router.post('/users/logout',auth,async (req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !==req.token
        })

        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send()
    }
})

//
router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]

        await req.user.save();
        res.send()
    }
    catch(e)
    {
        res.status(500).send()
    }
})
//route for reading users 
router.get("/users/me",auth,async(req,res)=>{
    

    res.send(req.user)
    // console.log("in usersssssssssssss")

    // try{

    //     const users=await User.find({});
    //     res.status(200).send(users)
    //     console.log(users)

    // }
    // catch(e){
    //     res.status(500).send()
    // }

    // // const users=await User.find({});


    // User.find({}).then((users)=>{
    //     res.status(200).send(users);
    // }).catch((error)=>{
    //     res.status(500).send();
    // });
})

//route for reading single user
// router.get("/users/:id",auth,async(req,res)=>{
  
//     const _id=req.params.id

//     try{
//         const user=await User.findById(_id);
        
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }catch(e){
//         res.status(500).send()
//     }
//     User.findById(_id).then((user)=>{
//         if(!user)
//         {
//             return res.status(404).send()
            
//         }
//         res.status(200).send(user)
//     }).catch((error)=>{
//         res.status(500).send()
//     });

// })


//route for updating the user

router.patch("/users/me",auth,async(req,res)=>{
   
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']

    const isValidOperation=updates.every(update=>allowedUpdates.includes(update))
    
    if(!isValidOperation){
        return res.status(400).send({error:"Invalid Update!"});
    }
    try{
       
        // const user=await User.findById(req.params.id)
        //new returns the updated data runValidators will run the validations
        //it bypasses the mongoose and performs operation seperately on the database
        //skips the save middleware
        // const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        
        
        // if(!user){
        //     return res.status(404).send()
        // }
        updates.forEach(update=>req.user[update]=req.body[update])
        await req.user.save();
       
        res.status(200).send(req.user);
    }catch(e){
        res.status(400).send(e);
        console.log(e)
    }
})

//route for deleting the user
router.delete("/users/me",auth,async(req,res)=>{

    try{
    
        // const user=await User.findByIdAndDelete(req.user._id) 
       
        // if(!user){
        //     res.status(404).send();
        // }
            
        await req.user.remove()
        res.status(200).send(req.user);

    }catch(e){
        res.status(500).send();
    }
})

const upload=multer({
    // dest:'avatars',
    limits:{
        fileSize:1000000 //it is 5mb
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            
            return cb(new Error('Please upload an image'))
            
        }

        cb(undefined,true)
    }

})

//upload.single('avatar') should match in the 
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    
    //png does not take any paramaters
    //resizing can be done using a GUI plug-in while doing it on the browser 
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()

    // req.user.avatar=req.file.buffer
    req.user.avatar=buffer

    await req.user.save()

    res.send();
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar', auth ,async (req,res)=>{

    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

//access via browser
router.get('/users/:id/avatar',async (req,res)=>{
    try{
        const user=await User.findById(req.params.id);

        if(!user || !user.avatar){
            
            throw new Error()
        
        }

        //setting a response header
        res.set('Content-Type','image/png')
        res.send(user.avatar)    
   
    }catch(e){
        console.log(e)
    }
})

module.exports=router;

