import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema({
    userid: {
        type: Object,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    itemname: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    expenseImagePath: {
        type: String
    },
    expenseType: {
        type: String, 
        required: true
    },
    accountId: {
        type: mongoose.Schema.Types.Mixed
    }
})




export const Expense =  mongoose.model('EXPENSE',expenseSchema)



