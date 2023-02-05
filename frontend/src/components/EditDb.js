import React, { useState, useRef, useEffect, useContext} from "react";
import { useHistory } from "react-router";

import style from "../styles/ExpenseAdd.module.css";
import styleEdit from "../styles/ExpenseEdit.module.css";

import axios from "axios";
import { loginStatusContext } from "../App";

import { profileImageValidation } from "../utils/validations.js";
import { download } from '../utils/downloadImage.js';

import { strings } from "../Strings";
import  {currencies}  from "../constant";
import  Alert from "../components/separate components/Alert";

import "date-fns";
import Datepicker from "./separate components/Datepicker";

// import deleteIcon from '../media/trash.png';
import attachIcon from "../media/attach.png";
import unAttachIcon from "../media/unattach.png";
import cross from '../media/cross.png';
import downloadIcon from '../media/download.png';
import BlockingOverlay from "./separate components/BlockingOverlay";

const eExpenseType = {
	income: 1,
	spent: 0, 
    invest: 2
}

const EditDb =  props  => {

    console.log("Edit Data opens");
    console.log(props.data);
    const { state } = useContext(loginStatusContext);
    const hist = useHistory();

    const {date, _id, userid, itemname, amount, currency , expenseImagePath, expenseType, accountId} = props.data;



    const inputImageRef = useRef(null);
    const [accounts, setAccounts] = useState(null);
    const [showAlert, setAlert] = useState(false);
    const [errorState, setErrorState] = useState({ flg: false, msg: "" });

    const [dataState, setData] = useState({ expenseId : _id,
                                            date: new Date(date),
                                            itemname: itemname, 
                                            amount: amount,
                                            currency: currency,
                                            accountId: accountId,
                                            expenseImage: expenseImagePath, 
                                            expenseType: expenseType});
    
    const [expenseImageName, setExpenseImageName]  = useState(expenseImagePath);
    const [ bIsExpenseImageChanged, setIsExpenseImageChanged ] = useState(false); 

    useEffect(() => {
        if(state.flg)
        {
            fetchAccounts();
        }
        else
            hist.push("/signin");
    }, []);

    const fetchAccounts = () => {
        axios.post('/fetchaccounts', {userId: state.userid})
        .then(res => {
            setAccounts(res.data);
        })
        .catch(err => {
            console.log("Fetch accounts error");
            console.log(err);
        })
    }

    const downloadAttachedImage = () => {
        download(`https://res.cloudinary.com/avadhootcloud/image/upload/v1645954451/expensetracker/${expenseImagePath}`, expenseImagePath);
    }
    const IsDateChanged =(date1, date2) =>{
        let d1 = new Date(date1);
        let d2 = new Date(date2);

        console.log(d1);
        console.log(d2);

        if(d1.getDate() != d2.getDate() || d1.getMonth() != d2.getMonth() || d1.getFullYear() != d2.getFullYear())
            return true;
        return false;
    }

    const getFormData = () => {
		const fd = new FormData();
		
		fd.append("expenseId", dataState.expenseId);

        if(IsDateChanged(date, dataState.date))
        {
            console.log("date changed");
            fd.append("date", new Date(dataState.date));
        }
		    
        
        if(itemname != dataState.itemname){
            console.log("itemname changed")
		    fd.append("itemname", dataState.itemname);
        }
        if(currency != dataState.currency){
            console.log("currency changed")
		    fd.append("currency", dataState.currency);
        }
        if(amount != dataState.amount){
            console.log("amount changed")
            fd.append("amount", dataState.amount);
        }

        if(accountId != dataState.accountId){
            console.log("account changed");
            fd.append("accountId", dataState.accountId);
        }

        if(expenseType != dataState.expenseType){
            console.log("expense type changes");
            fd.append("expenseType", dataState.expenseType);
        }

        console.log(`Image changed ${bIsExpenseImageChanged}`);
        if(bIsExpenseImageChanged && expenseImageName != ""){
            console.log("image changed");
		    fd.append("expenseImage", dataState.expenseImage);
        }

        if(expenseImageName == "")
        {
            console.log("image removed");
            fd.append("expenseImage", "");
        }
		return fd;
    }
    
    const handleChange = (date) =>{
        setErrorState({ flg: false, msg: "" });
        setData({ ...dataState, date: date });
    }

    const inputHandler = (e) => {
        setErrorState({ flg: false, msg: "" });
        const fieldName = e.target.name;
        let fieldvalue;
        
        if(fieldName === "expenseImage")
        {
            if(expenseImageName != "")
			{
                console.log("Input handler image removed");
				setData({ ...dataState, [fieldName]: null });
				setExpenseImageName("");
				return;
			}
            if(profileImageValidation(e.target.files[0]))
            {
                setExpenseImageName(e.target.files[0].name);
                const reader = new FileReader();
				reader.readAsDataURL(e.target.files[0]);
                setIsExpenseImageChanged(true);

				reader.onloadend = () => {
					setData({ ...dataState, [fieldName]: reader.result });
				}    
            }
            else
                setErrorState({flg:true, msg: strings.ERROR_IMG_SIZE_EXCEED});
        }
        else
        {
            fieldvalue = e.target.value;
            setData({ ...dataState, [fieldName]: fieldvalue });
        }
    }

    // const removeImageHandler = () =>{
    //     setData({ ...dataState, expenseImageRemoveButton: null });
    // }

    const validateData = () => {
        if(dataState.date == "" || dataState.itemname == "" || dataState.currency == "" 
            || dataState.amount == "" || (dataState.accountId == null && accounts != null && accounts.length > 0))
            {
                return false;
            }
        return true;
    }
 
    const submitHandler = (e) => {
        console.log(dataState);
        e.preventDefault();
    
        if(!validateData())
        {
            setErrorState({ flg: true, msg: strings.ERROR_REQUIRED_FIELDS });
            return;
        }

        axios.post("/expenseupdate", getFormData(),
        {
            headers: {
            "Content-type": "multipart/form-data",
            },
        })
        .then((res) => {
            if (res.status === 200) {
                HideEditDb(true);
                setAlert(true);
            }
        })
        .catch((err) => {
            switch (err.response.status) {
            case 500:
                setErrorState({ flg: true, msg: strings.ERROR_NO_USER });
                break;
            case 401:
                setErrorState({ flg: true, msg: strings.ERROR_UNAUTORISED });
                break;

            default:
                return null;
            }

        });
    }

    const HideEditDb = (bReloadRecords) => {
        props.HideEditDb(bReloadRecords);
    }

    return (
        <>
        <BlockingOverlay showLoader={false}/>
        {
            showAlert && (
                <Alert text="Expense Updated" delay={3000} bShowCloseButton={true}/>
            )
		}
		<div className={`${style.formBox} ${styleEdit.formBox}`}>
			<h1 className={styleEdit.heading}>{strings.TITLE_EDIT_DB}</h1>
			
            {
                errorState.flg && <h5 className={style.alert}>{errorState.msg}</h5>
            }

            <img onClick={()=>HideEditDb()} src={cross} className={styleEdit.cross} alt="close"></img>

			<form onSubmit={submitHandler} noValidate>
                <div className={style.expenseTypeContainer}>
                    <label className={style.expenseTypeLabel}>
                        <input type="radio" checked={eExpenseType.income == dataState.expenseType} value={eExpenseType.income} onChange={inputHandler} className={style.expenseTypeInput} name="expenseType"></input>
                        
                        <span className={style.checkmark}></span>
                        Income
                    </label>
                
                    <label className={style.expenseTypeLabel}>
                        <input type="radio" checked={eExpenseType.spent == dataState.expenseType} value={eExpenseType.spent} onChange={inputHandler} className={style.expenseTypeInput} name="expenseType"></input>
                        
                        <span className={style.checkmark}></span>
                        Spent
                    </label>

                    <label className={style.expenseTypeLabel}>
                        <input type="radio" checked={eExpenseType.invest == dataState.expenseType} value={eExpenseType.invest} onChange={inputHandler} className={style.expenseTypeInput} name="expenseType"></input>
                        
                        <span className={style.checkmark}></span>
                        Investment
                    </label>
                </div>
				<Datepicker formatandhandler={{ state: dataState.date, format: "dd/MM/yyyy", view: ["year", "month", "date"], handler: handleChange,}}/>
				<div>
					<input className={style.itemInput} name="itemname" value={dataState.itemname} onChange={inputHandler}  placeholder="Item Name"  required></input>
				</div>
			
				<div>
					<select className={style.currencySelectInput} name="currency" onChange={inputHandler}>
						<option aria-label="None" value="">{strings.CURRENCY}</option>

                        {
                            currencies.map(currency =>{
                            return <option key={currency.id} value={currency.id} selected={currency.id == dataState.currency}>{currency.value}</option>
                            })
                        }

					</select>

					<input className={style.amountInput} name="amount"  value={dataState.amount} onChange={inputHandler}  placeholder="Amount"  required></input>
				</div>

                {
                    (accounts != null && accounts.length > 0) && (

                    <div>
                        <select className={style.accountSelectInput} name="accountId" onChange={inputHandler}>
                        <option aria-label="None" value="">{strings.SELECT_ACCOUNT + "*"}</option>
                        {
                            accounts.map(account =>{
                            return <option key={account._id} value={account._id} selected={account._id == dataState.accountId}>{account.accountName}</option>
                            })
                        }
                        </select>
                    </div>
                    )
                } 

                <div className={style.expenseImageContainer}>
                {
                    expenseImageName == "" && (
                        <>
                            <input name="expenseImage" className={style.expenseImageInput} accept="image/*" ref={inputImageRef} type="file" onChange={inputHandler}></input>
                            <button type="button" className={style.expenseImageButton}  onClick={()=> inputImageRef.current.click()}>
                                <img src={attachIcon} className={style.expenseImageButtonIcon}/>
                            </button>
                        </>
                    )
                }
                {
                   expenseImageName != "" && (
                        <button name="expenseImage" type="button" title="Unattach image" className={style.expenseImageButton} onClick={inputHandler}>
                            <img src={unAttachIcon} className={style.expenseImageButtonIcon}/>
                        </button>
                   ) 
                }
                
                {
                    expenseImagePath != "" && ( 
                        <button title = "Download saved image" type="button" name="expenseImageRemoveButton" className={style.expenseImageButton} onClick={downloadAttachedImage}>
                            <img src={downloadIcon} className={styleEdit.expenseImageRemoveIcon}/>
                        </button> 
                    )
                }

                {
                    expenseImagePath == "" && !bIsExpenseImageChanged && (
                        <p className={style.expenseImageName}>No image attached</p>
                    )
                }
                
                </div>
        
				<button type="submit" className="btnSubmit">{ strings.DONE }</button>
				
            </form>
		</div>		  
      </>
    )
}

export default EditDb;
