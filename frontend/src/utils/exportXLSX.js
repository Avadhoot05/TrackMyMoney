
import * as XLSX from 'xlsx';
import { currencyMap } from '../constant';
import moment from 'moment';
import { download } from './downloadImage';

/**
 * export array of array to sheet (1st Array: all headings, 2nd Array: first row of sheet)
 * @param {Array<Array>} data 
 * @param {string} fromDate
 * @param {string} toDate
 * @returns {void}
 */
export const exportXLSX = (data, fromDate, toDate) => {
    let from = moment(fromDate).format("DD-MM-YYYY");
    let to = moment(toDate).format("DD-MM-YYYY");

    let fileName = `Expenses_${from}-to-${to}`; 
    console.log(`Export as ${fileName}.xlsx`)
   
    let arrExpenseType = ["spent", "income", "investment"]
    let res = [[`This file contains records from ${from} to ${to}`], [],
        ["Date", "Name", "Amount", "Account", "Type"]];
    
    for(let i = 0; i < data.length; i++)
    {
        res.push([
            moment(data[i]["date"]).format("DD-MM-YYYY"), 
            data[i]["itemname"], 
            currencyMap[data[i]["currency"]] +data[i]["amount"],
            data[i]["accountName"],
            arrExpenseType[parseInt(data[i]["expenseType"])]
            ]);
    }
	
    

    let wb = XLSX.utils.book_new();
    wb.Props = {
        Title: "Expenses", 
        Author: "Track My Money", 
        CreationDate: new Date()
        };

    wb.SheetNames.push("My Expenses");

    //array of array to sheet
    var ws = XLSX.utils.aoa_to_sheet(res);
    wb.Sheets["My Expenses"] = ws;

    let wbOut = XLSX.write(wb, {bookType: "xlsx", type: "binary"});
    
    function s2ab(s) { 
        var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        var view = new Uint8Array(buf);  //create uint8array as viewer
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf;    
    }

	download(new Blob([s2ab(wbOut)], {type:"application/octet-stream"}), `${fileName}.xlsx`);
}