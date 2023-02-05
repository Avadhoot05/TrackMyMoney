import { Expense } from "../model/expenseSchema.js";
import mongoose from "mongoose";

export const insights = async ( req, res )=>{
    const obj =  {userid: mongoose.Types.ObjectId(req.body.userId)};

    try
    {
        let response = null;
        response = await Expense.aggregate( [
            { 
                $match: { 
                    $and: [ obj, {
                                date: {
                                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) , $lte: new Date() 
                                }
                            }
                        ],
                
                    } 
            }
            ] )

        console.log(">>>>>>>>>insights response");
        console.log(response);
        response? res.status(200).send(response) : res.status(500).send("No matches");

    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
}



// const response = await Expense.aggregate([
//     { 
//         $match: {
//             userid: mongoose.Types.ObjectId(userId),
//         } 
//     },
//     { 
//         $group: { 
//             _id: null,  
//             currency: {"$first": "$currency"},
//             expenseType: {"$first": "$expenseType"},
//             sum : { $sum: "$amount" } 
//         } 
//     }]);