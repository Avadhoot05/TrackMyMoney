import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    pswd:{
        type: String,
        required:true
    },
    cpswd:{
        type: String,
        required:true
    },
    limit: {
        type: Number,
    },
    accounts: [ 
        {
        type: String,
        }
    ],
    tokens:[
        {
        token: {
            type:String,
            required:true
            }
        }
    ]
})

//Password Hashing
userSchema.pre('save', async function(next){
    if(this.isModified('pswd')){
        this.pswd = await bcrypt.hash(this.pswd, 12);
        this.cpswd = await bcrypt.hash(this.cpswd, 12);
    }
    next();
})


userSchema.methods.generateAuthToken = async function(){
    try 
    {
        const tokenKey = process.env.EXPENSETRACKER_TOKEN_KEY
        let curr_token = jwt.sign({_id:this._id},tokenKey)

        this.tokens = this.tokens.concat({token:curr_token})
        await this.save()
        return curr_token
    } 
    catch (err) 
    {
        console.log(err)
        
    }
}

userSchema.methods.addAccounts = async function(account){
    try 
    {
        console.log(account)
        this.accounts = this.accounts.concat(account)
        await this.save()    
        return true
    } 
    catch (err) 
    {
       console.log(err) 
       return false
    }
    
}

export const User =  mongoose.model('USER',userSchema)




