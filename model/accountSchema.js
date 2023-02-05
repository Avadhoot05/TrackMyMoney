import mongoose from 'mongoose'

const accountSchema = new mongoose.Schema({
    userid:{
        type:Object,
        required:true
    },
    accountName: {
        type: String, 
        required: true
    }
})




export const Account =  mongoose.model('ACCOUNT',accountSchema)



