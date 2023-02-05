import { User } from "../model/userSchema.js"
import mongoose from "mongoose"
import { Account } from "../model/accountSchema.js"

export const FetchAccount = async (req,res) => {
    const userId = req.body.userId;
    
    try{
        const response = await Account.find({userid: mongoose.Types.ObjectId(userId)});
        res.status(200).send(response);
           
    }
    catch(e){
        console.log(e);
    }
   
}