import { User } from '../model/userSchema.js';
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const createUser = async (req,res)=>{

    const {name, email, pswd, cpswd} = req.body;

    try{
        const isUserExists = await User.findOne({email});

        if(isUserExists) 
            return res.status(420).json({msg:"User already exists"});
        
        const user = new User({name, email, pswd, cpswd});
        
        const isUserCreated = await user.save();
        if(isUserCreated)
            res.status(200).json({msg:"Registration Successful"});
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({msg:"Registration Failed"});
    }
}

export const EditUser = async (req, res) => {
    const {userId, name, email, opswd, pswd, cpswd} = req.body;
    console.log(">>>>>>>>>>>Edited data");
    console.log(req.body);

    try {
        const user = await User.findOne({
            "_id": mongoose.Types.ObjectId(userId)
        });

        if(!user)
        {
            console.log("No user");
            return;
        }
        
        const bIsPasswordMatched = await bcrypt.compare(opswd, user.pswd);

        if(!bIsPasswordMatched)
        {
            console.log("Old Password not matching")
            return;
        }
        console.log("Password match")
        const userUpdate = await User.updateOne(
            {
                '_id': mongoose.Types.ObjectId(userId)
            }, 
            {           
                $set: { name, email, pswd, cpswd }
            });
        console.log(">>>>>>userUpdate")
        console.log(userUpdate);
        if(userUpdate)
            console.log(">>>>>>USer update success");


    } catch (error) {
        console.log(error)
    }

}