const express=require('express')

const Task=require('../models/task')

const auth=require('../middleware/auth')
const router=express.Router();

//route for creating the new task
router.post('/tasks',auth,(req,res)=>{

    // const task=new Task(req.body);

    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    task.save().then(()=>{
        res.status(201).send(task);
    }).catch((error)=>{
        res.status(400).send(error);
    })
})


//route for reading tasks
router.get('/tasks',auth,async(req,res)=>{

    try{
        const tasks=await Task.find({owner:req.user._id});    
        res.status(200).send(tasks)

        await req.user.populate('tasks').execPopulate();
        res.send(req.user.task)

    }catch(e){
        res.status(500).send();
    }
    // Task.find().then((tasks)=>{
    //     res.status(200).send(tasks)

    // }).catch((error)=>{
    //     res.status(500).send();
    // });
})

//roure for reading single tasks
router.get('/tasks/:id',auth,async(req,res)=>{
    
    try{
        // const task=await Task.findById(req.params.id);
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id});

        if(!task){
            return res.status(404).send()
        }
        res.status(200).send(task);
    
    }catch(e){
        res.status(500).send();
    }
    // Task.findById(req.params.id).then((task)=>{
    //     res.status(200).send(task);

    // }).catch((error)=>{
    //     res.status(500).send();
    // })
})

//route for updating task
router.patch("/tasks/:id",auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['description','completed'];
    
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
     
    if(!isValidOperation){
        res.status(400).send({error:"Invalid Updates!"})
    }
    try{

        // const task=await Task.findById(req.params.id)
       
        // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});

        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})

        if(!task){
            res.status(404).send();
        }
        updates.forEach(update=>task[update]=req.body[update])
        await task.save();

        res.status(200).send(task)    
    }catch(e){
        res.send(400).send(e)
    }
})

//route for deleting a task
router.delete("/tasks/:id",auth,async(req,res)=>{

    try{
    
        // const task=await Task.findByIdAndDelete(req.params.id)
        const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            res.status(404).send()
        }    
        res.status(200).send(task)
    }catch(e){
        res.status(500).send();
    }
})

module.exports=router;