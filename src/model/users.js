//creating a mongoose model
const mongoose=require('mongoose');
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    }
    ,
    email:{
        unique:true,
        type:String,
        required:true,
        lowercase:true,
        validate (value){
            if(!validator.isEmail(value))
            {
                throw new Error('Invalid email entered')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
        validate(pswd){
            // if(pswd.length<6)
            // throw new Error('too short password');

            // if(password=='password')
            // throw new Error('password cannot be password itself!!')

            if(pswd.toLowerCase().includes('password'))
            {
                throw new Error('password cannot be password itself!!')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    age:{
        type:Number,
        //data validation
        default:0,
        validate (value) {
            if(value<0)
            throw new Error('age must be a positive number')
        }
    }
})

//creating and sending json web token
//method is used for instance methods
//creating standard function bcz using 'this' binding
userSchema.methods.generateAuthenticationToken= async function(){
    const user=this
    const token=jwt.sign({_id:user.id.toString()},'thisismyfirsttokeninnodejs')
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token;

}

//Hash the plain text password before saving
userSchema.pre('save',async function(next){
    const user=this
    //valid in both creating password for a new user or updating password of existing user
    if(user.isModified('password'))
    {
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})

//fetch user details when a user tries to login with email and password
//model method 
userSchema.statics.findByCredentials=async (email,password)=>{
    const user=await User.findOne({email:email})
    if(!user)
    throw new Error('Unable to login')
    
    //compare plain text password with hash
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch)
    //if we send msg as email is right but wrong password then it exposes more risk 
    throw new Error('Unable to login')

    return user
}
const User=mongoose.model('User',userSchema);

module.exports=User;