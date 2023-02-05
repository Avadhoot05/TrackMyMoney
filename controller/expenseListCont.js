import { Expense } from "../model/expenseSchema.js"
import mongoose from 'mongoose'
import { updateResponseWithAccounts } from "../helper/UpdateResponse.js"

const actionType = {
	edit: 1,
	delete: 2
}

const QueryMode = {
	fetchRecords: 1,
	updateRecords: 2 
}

export const expenseList = async (req,res)=>{
    const mode = req.body.mode;


    if(mode == QueryMode.fetchRecords)
    {
        const userID = mongoose.Types.ObjectId(req.body.userid);
        
        const {date, expenseType, currency, account, amount} = req.body.filterAttributes;
        
        let obj = null;
        

        if(req.body.filterAttributes)
        {
            
            obj =  {userid: userID };

            if(expenseType.status)
                obj = {...obj, expenseType: expenseType.value};
            
            if(currency.status)
                obj = {...obj, currency: currency.value };
            
            if(account.status)
                obj = {...obj, accountId: mongoose.Types.ObjectId(account.value) };

        }
        
        console.log(obj);
        let response = null;
        if(amount.status){
            response = await Expense.aggregate( [
                { $match: { 
                    $and: [
                        obj,
                        {
                            date: {
                                $gte: new Date(date.value.from) , $lte: new Date(date.value.to) 
                            },
                            amount: {
                                $gt: parseInt(amount.value.from)  , $lt: parseInt(amount.value.to) 
                            }
                        }
                    ],
                    
                } },
                {
                    $lookup:
                      {
                        from: "accounts",
                        localField: "accountId",
                        foreignField: "_id",
                        as: "account"
                      }
                 }
             ] )
        }
        else{
            response = await Expense.aggregate( [
                { $match: { 
                    $and: [
                        obj,
                        {
                            date: {
                                $gte: new Date(date.value.from) , $lte: new Date(date.value.to) 
                            }
                        }
                    ],
                    
                } },
                {
                    $lookup:
                      {
                        from: "accounts",
                        localField: "accountId",
                        foreignField: "_id",
                        as: "account"
                      }
                 }
             ] )
        }
        
        const updatedResponse = updateResponseWithAccounts(response);
        
        updatedResponse? res.status(200).send(updatedResponse) : res.status(500).send("No matches");
    }
    else if(mode == QueryMode.updateRecords)
    {
        const action = req.body.action;
        if(action == actionType.delete)
        {
            const response = await Expense.deleteOne({'_id':mongoose.Types.ObjectId(req.body.expenseId)});
    
            // for (const [key, value] of Object.entries(response)) {
            //     console.log(`${key}---${value}\n`)
            //   }

            response.deletedCount?res.status(200).send("One expense deleted"):res.status(200).send("No matches");
        }
        else if(action == actionType.edit)
        {
            //code for edit expense here
        } 
    }
}