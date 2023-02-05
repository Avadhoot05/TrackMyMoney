import { User } from "../model/userSchema.js"
import { Account } from "../model/accountSchema.js"
import mongoose from "mongoose"
import { Expense } from "../model/expenseSchema.js"

export const AddUserAccounts = async (req,res) => {

    const {accounts, userId} = req.body.data

    try{
        const user = await User.findOne({'_id':mongoose.Types.ObjectId(userId)})
        if(user)
        {
            for (const name of accounts) 
            {
                const account = new Account({userid:mongoose.Types.ObjectId(userId), accountName: name})
                const isAccountAdded = await account.save()
    
            }
        
            res.status(200).json({msg:"Added Sucessfully"})
            
        }
        else
        {
            res.status(420).json({msg: "User not found"})
        }

    }
    catch(e)
    {
        console.log(e)
    }
   
}

const AccountDeleteType = {
    delete: 1,
    transferAndDelete: 2
}


export const DeleteUserAccount = async (req, res) => {
    const {accountDeleteType, userId, accountDeleteId, accountTransferId} = req.body;

    if(accountDeleteType == AccountDeleteType.delete){
        try {
            const accountId = mongoose.Types.ObjectId(accountDeleteId);
            console.log(`%cdeleted account Id ${accountId}`);
            const response = await Account.deleteOne({'_id':accountId});

            const responseForDeleteExpense = await Expense.deleteMany({accountId: mongoose.Types.ObjectId(accountDeleteId)});
            console.log(responseForDeleteExpense)
        
            response.deletedCount ? res.status(200).json({deletedCount: responseForDeleteExpense.deletedCount.toString()}) : res.status(404).send("No matches"); 
        } catch (error) {
            console.log(error);
            res.status(500).send("Failure");
        }
        
    }
    else{
        try {
            console.log("Transfer and delete");
            const responseForUpdate = await Expense.updateMany({
                userid: mongoose.Types.ObjectId(userId), accountId: mongoose.Types.ObjectId(accountDeleteId)
            }, 
            {accountId: mongoose.Types.ObjectId(accountTransferId)});

            console.log("*****************");
            console.log(responseForUpdate);
            const accountId = mongoose.Types.ObjectId(accountDeleteId);
        
            const response = await Account.deleteOne({'_id':accountId});
        
            response.deletedCount ? res.status(200).json({modifiedCount: responseForUpdate.nModified.toString()}) : res.status(404).send("No matches");  
        } catch (error) {
            console.log(error);
            res.status(500).send("Failure");
        }
    }
    

    


}