const express=require('express');
const res = require('express/lib/response');
const User=require('../model/users')
const router=new express.Router();
const jwt=require('jsonwebtoken')
const auth=require('../middleware/auth')

router.get('/test',(req,res)=>{
    res.send('router from a new file')
})

//reading data from server/database and sending it to page
//getting all users from the database
// router.get('/users',auth,async (req,res)=>{

//     const users=await User.find({})
//     try{
//         res.status(200).send(users)
//     }
//     catch (e) {
//         res.status(400).send()
//     }
//     // User.find({}).then((users)=>{
//     //     res.send(users);
//     // }).catch((err)=>{
//     //     res.status(400).send(err);
//     // })
// })

//fetches a particular user, providing token in postman
router.get('/users/me',auth,async(req,res)=>{
    res.send(req.user)
})
//get user from database by giving age
router.get('/users/:id',auth,async (req,res)=>{
    const _id=req.params.id

    const user=await User.findById(_id)
    try{
        if(!user)
        res.status(404).send()
       res.status(200).send(user) 
    }
    catch(e){
        res.status(500).send(e);
    }
// User.findById(_id).then((user)=>{
//     if(!user)
//     res.status(404).send();
//     res.status(200).send(user)
// }).catch((err)=>{
//     res.status(500).send(err)
// })
})
// app.post('/user',(req,res)=>{
// res.send('testing')
// })

//send data via an http req off to the express server using a predefined operation
//we are able to do manipulation in database like creating an user
// app.post('/users',(req,res)=>{
//    const user=new User(req.body);
//    user.save().then(()=>{
//        res.send(user);
//    }).catch((err)=>{
//        res.status(400);
//        res.send(err);
//    })

// })

//sign up
router.post('/users',async (req,res)=>{
    const user=new User(req.body);
    try{
        await user.save()
        const token=user.generateAuthenticationToken()
        res.status(200).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
 })

 //user login 
 //get user details by its email and password
 //we are logging in to just see our own user details stored
 router.post('/users/login',async (req,res)=>{
     try{
          const user=await User.findByCredentials(req.body.email,req.body.password)
          //creating method of object instance
          const token=await user.generateAuthenticationToken()
          //res.status(200).send(user)
          res.status(200).send({user,token})
     }catch(e){
             res.status(400).send(e)
     }
 })

 //logout user
 router.post('/users/logout',auth,async(req,res)=>{
try{
     req.user.tokens=req.user.tokens.filter((token)=>{//here token is an object
         return token.token!=req.token
        })
     await req.user.save()

     res.send()
}catch(Err){
   res.status(500).send()
}
 })

 //logout all users
 router.post('/users/logoutall',auth,async(req,res)=>{
    try{ req.user.token=[]
     await req.user.save()
     res.status(200).send()
    }catch(e)
    {
       res.status(500).send()
    }

 })
 //updating values in the database using object id
router.patch('/users/:id',async (req,res)=>{
    const _id=req.params.id
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidOp=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOp)
    return res.status(400).send('not a valid update')
    
    // const user=await User.findByIdAndUpdate(_id,{name:'deepika'})
    try{
        const user=await User.findById(_id)
        updates.forEach((update)=>user[update]=req.body[update])
        await user.save()
    //const user=await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
    if(!user)
    res.status(404).send('no such id found')
    res.status(200).send(user);
    }
    catch(err){
    res.status(400).send(err)
    }
    })

    //deleting user by its given id
router.delete('/users/:id',async (req,res)=>{
    const _id=req.params.id
    try{
       const user=await User.findByIdAndDelete(_id)
       if(!user)
       res.status(400).send('no user found with this id')
       
       res.status(200).send(user)
    }catch (e){
        res.status(400).send(e)
    }
})

module.exports=router