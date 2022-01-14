const express=require('express')
const router=new express.Router()
const Task=require('../model/tasks')

router.get('/tasks',async (req,res)=>{

    const tasks=await Task.find({})
    try{
        res.status(200).send(tasks)
    }
    catch (e) {
        res.status(400).send()
    }
    // User.find({}).then((users)=>{
    //     res.send(users);
    // }).catch((err)=>{
    //     res.status(400).send(err);
    // })
})

router.post('/tasks',async (req,res)=>{
    const task=new Task(req.body);
    
    try{
        await task.save();
        res.send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
    // //promise
    // task.save().then(()=>{
    //     res.send(task);
    // }).catch((err)=>{
    //     res.status(400).send(err);
    // })
    })
    
    //therefore we have converted all our app express handler over to async and await
    
    
    //updating tasks values in database using object id
    router.patch('/tasks/:id',async (req,res)=>{
        const _id=req.params.id
        const updates=Object.keys(req.body)
        const allowedUpdates=['task','completed']
        const isValidOperation=updates.every((update)=>{return allowedUpdates.includes(update)})
        if(!isValidOperation)
        res.status(400).send('not a valid update')
    
        try{
            const task=await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
            if(!task)
            res.status(400).send('no such task found with this id')
    
            res.status(200).send(task);
        }catch (e){
            res.status(400).send(e)
        }
    })
    
    
    //deleting task by its given id
    router.delete('/tasks/:id',async (req,res)=>{
        const _id=req.params.id
        try{
           const task=await Task.findByIdAndDelete(_id)
           if(!task)
           res.status(400).send('no task found with this id')
           
           res.status(200).send(task)
        }catch (e){
            res.status(400).send(e)
        }
    })


    module.exports=router
    