

const Expense = require("../model/expenseSchema")

const getExpenseList = (req,res)=>{
    console.log(`-----${req.userID}`)
    

        Expense.find({userid:req.userID})
        .then(resp=>{
            // console.log(`--------resp---${resp}`)
            req.expenses = resp
            return req
        })
        .catch(err=>{
            res.status(401).send("No expenses added yet")
        })
        
        // if(expenses){
        //     req.expenses = expenses
        // }
        // else{
        //     res.status(401).send("No expenses added yet")
        // }
     
    
}


module.exports  = getExpenseList