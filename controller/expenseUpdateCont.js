import { Expense } from "../model/expenseSchema.js";
import mongoose from "mongoose";
import { UploadImage } from "../helper/ImageUploader.js";


export const expenseUpdate = async (req, res) => {
    console.log("update");
    console.log(req.body);

    let expenseImagePath = "";

    if("expenseImage" in req.body)
    {
        const expenseImage = req.body.expenseImage;

        if(expenseImage != "")
        {
            const UploadImageResponse = await UploadImage(expenseImage);
        
            if(!UploadImageResponse) {
                res.status(400).send("Error while uploading image");
                return;
            }
                
            //slicing the initial part because that contains cloud name, preset name. (the initial part is in env)
            expenseImagePath = UploadImageResponse.secure_url.slice(UploadImageResponse.secure_url.lastIndexOf("/") + 1); 
        }
    }

    let expenseId = req.body.expenseId;

    let data = {};

    if("date" in req.body)
        data["date"] = new Date(req.body.date);

    if("itemname" in req.body)
        data["itemname"] = (req.body.itemname).toLowerCase();

    if("currency" in req.body)
        data["currency"] = req.body.currency;
    
    if("amount" in req.body)
        data["amount"] =  parseFloat(req.body.amount);
    
    if("expenseType" in req.body)
        data["expenseType"] = req.body.expenseType;
    
    if("accountId" in req.body)
        data["accountId"] = mongoose.Types.ObjectId(req.body.accountId);

    if("expenseImage" in req.body)
        data["expenseImagePath"] = expenseImagePath;

    //const { expenseId, date, itemname, currency, amount } = req.body;
    console.log(">>>>>>>>>>>Edit data");
    console.log(data);
    try
    {
        const response = await Expense.updateOne(
            {
                '_id':mongoose.Types.ObjectId(expenseId)
            }, 
            {           
                $set: data
            })
        
        if(response)
            res.status(200).json({ msg: "Updated Sucessfully"});
    }
    catch(e)
    {
        console.log(e);
    }
}