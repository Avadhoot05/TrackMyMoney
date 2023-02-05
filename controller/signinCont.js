
import bcrypt from "bcryptjs";
import { User } from '../model/userSchema.js';

export const signinUser = async (req, res)=>{
    console.log("sign in");
    const { email, pswd } = req.body;

    try 
    {
        const userLogin = await User.findOne({email});

        //check is email exists in databse
        if(userLogin){
    
            const token = await userLogin.generateAuthToken();
    
            await res.cookie("jwtoken",token,{
                expires: new Date(Date.now + (10*24*60*60*1000)),
                httpOnly:true
            })
    
            //check is email and pswd matched or not
            const isMatched = await bcrypt.compare(pswd, userLogin.pswd);
            isMatched ? res.status(200).send(userLogin): res.status(420).json({error:"Invalid Credentials"});
        }
        else res.status(420).json({error:"Invalid Credentials"});
    } 
    catch (error) 
    {
        res.status(500).json({error:"Something went wrong"});
    }   
}