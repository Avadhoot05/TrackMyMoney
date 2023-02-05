import mongoose from 'mongoose'
import dotenv from "dotenv"

dotenv.config({ path: "./config.env" });

const DBurl = process.env.EXPENSETRACKER_DATABASE

mongoose.connect(DBurl,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false})
  .then(()=>console.log('Connection successful'))
  .catch(err=>console.log(err))