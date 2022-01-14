//const validator=require('validator');
//const chalk=require('chalk');

//using mongoose to make model and structure our data in a nice way
const mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{useNewUrlParser:true,useCreateIndex:true,useFindAndModify:false});

//creating Habit collection
const Habit=mongoose.model('Habit',{
    nature:{
        type:String,
        required:true,
        trime:true
    },
    detect:{
        type:Boolean,
        default:false
    }
})


//creating new instance of model
//const ishu=new Habit({nature:'loving',detect:true}).save().then(()=>{console.log(ishu)}).catch((err)=>{console.log("error found")})