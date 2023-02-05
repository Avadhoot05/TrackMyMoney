export const updateResponseWithAccounts = (expenses) => {
    let updatedResponse = [];
    console.log(expenses);
    try 
    {
        for (const expense of expenses) 
        {
            const accountName = (expense.account)[0].accountName;
            delete expense['account'];
            updatedResponse.push({...expense, accountName });
        }
        return updatedResponse;
    } 
    catch (error) 
    {
        console.log(error);
        return false;   
    }
    
}   