const chalk=require('chalk');
const express=require('express');
const jwt=require('jsonwebtoken')

//want to run mongoose file to connect with database
require('./db/mongoose')
const app=express();


const userRouter=require('./router/users')
const taskRouter=require('./router/tasks')

app.use(express.json())
const port=process.env.PORT||3000

app.use(userRouter)
app.use(taskRouter)


app.listen(port,()=>{
    console.log(chalk.inverse('server is up on port '+port))
})

