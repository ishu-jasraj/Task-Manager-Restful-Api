const jwt=require('jsonwebtoken')
const User=require('../model/users')

const auth=(async (req,res,next)=>{
    try{
       const token=req.header('Authorization').replace('Bearer ','')
       console.log(token)
       //validates the header obtained
       const decode=jwt.verify(token,'thisismyfirsttokeninnodejs')
       //finds associated user
       const user=await User.findOne({_id:decode._id,'tokens.token':token})
       if(!user){
           throw new Error()
       }

       req.user=user
       next()
    }
    catch(err)
    {
        res.status(404).send({error:'please authenticate'})
    }
})

module.exports=auth