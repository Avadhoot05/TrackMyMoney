import { Expense } from "../model/expenseSchema.js";
import mongoose from "mongoose";
import { UploadImage } from "../helper/ImageUploader.js";


export const expenseAdd = async (req,res)=>{

    let expenseImagePath = "";

    if(("expenseImage" in req.body))
    {
        const expenseImage = req.body.expenseImage;

        const UploadImageResponse = await UploadImage(expenseImage);
        
        if(!UploadImageResponse) {
            res.status(400).send("Error while uploading image");
            return;
        }
            

        //slicing the initial part because that contains cloud name, preset name. (the initial part is in env)
        expenseImagePath = UploadImageResponse.secure_url.slice(UploadImageResponse.secure_url.lastIndexOf("/") + 1); 
    }
    
    const {userID, date, itemname, currency, amount, expenseType, account} = req.body;
    
    try {
        const d = new Date(date);
        console.log("**********************")
        
        let accountId;
        if(account != "null")
        {
            accountId = mongoose.Types.ObjectId(account);
        }
        else
        {
            accountId = null;
        }
        const expense = new Expense({
            userid:mongoose.Types.ObjectId(userID), 
            // "date.date":d.getDate(), 
            // "date.month":d.getMonth()+1, 
            // "date.year":d.getFullYear(), 
            date: new Date(date),
            itemname:itemname.toLowerCase(), 
            currency, 
            amount: parseFloat(amount), 
            expenseImagePath, 
            expenseType,
            accountId });

        const isexpenseAdded = await expense.save();
        if(isexpenseAdded)
            res.status(200).json({msg:"Added Sucessfully"});
        
    } catch (err) {
        res.status(401).send("Unauthorized: No token found");
        console.log(err);
    }
}