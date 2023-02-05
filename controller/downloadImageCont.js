import { Expense } from "../model/expenseSchema.js"
import mongoose from "mongoose"
import fs from "fs"

export const downloadImage = async (req,res) => {
    const expenseId = mongoose.Types.ObjectId(req.body.expenseId)
    console.log(expenseId)
    const response = await Expense.findOne({_id: expenseId})
    
    const hasImage = response.hasOwnProperty("expenseImagePath") && response.expenseImagePath != null
    
    console.log(response.expenseImagePath)
    if(true){

        fs.readFile(`./public/expense/${response.expenseImagePath}`, (err, content) =>{
            if(err){
                console.log(`read ./public/expense/${response.expenseImagePath} does not exist`)
                res.writeHead(404, { "content-type" : "text/html"})
                res.end("<p>No Image</p>")
            }
            else{
                res.writeHead(200, { "content-type" : "image/jpg"})
                res.end(content)
            }
        })
    }
        //res.status(200).sendFile(response.expenseImagePath, { root: "." })
        //res.download(response.expenseImagePath)
    else {
        res.writeHead(404, { "content-type" : "text/html"})
        res.end("<p>No Image</p>")
    }
   
}