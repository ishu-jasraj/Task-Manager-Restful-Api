const mongoose=require('mongoose');

const Task=mongoose.model('Task',{
    task:{
        type:String,
        require:true,
        lowercase:true
    },

    completed:{
        type:Boolean,
        default:false
    }
})

//const task=new Task({task:"pot plants",completed:false}).save();

module.exports=Task;