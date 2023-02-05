import React, { useState, useEffect, useContext , useRef} from "react";
import { useHistory } from "react-router";

import style from "../styles/ExpenseAdd.module.css";
import axios from "axios";
import { loginStatusContext } from "../App";

import "date-fns";
import Datepicker from "./separate components/Datepicker";
import  Alert from "../components/separate components/Alert"

import { profileImageValidation } from "../utils/validations.js";
import BlockingOverlay from "./separate components/BlockingOverlay";

import { currencies } from "../constant";
import { strings } from "../Strings";

import attachIcon from "../media/attach.png";
import unAttachIcon from "../media/unattach.png";
import RedirectionDB from "./separate components/RedirectionDB";

const eExpenseType = {
	income: 1,
	spent: 0, 
	invest: 2
}

function ExpensesAdd() 
{
	const hist = useHistory();
	const [expenseinfo, setExpenseInfo] = useState({
													userID: {},
													date: new Date(),
													itemname: "",
													currency: 1,
													amount: "",
													expenseImage: null,
													expenseType: eExpenseType.income,
                          							account: null
													});
    
	const [expenseImageName, setExpenseImageName]  = useState("");

	const inputImageRef = useRef(null);

	const [accounts, setAccounts] = useState(null);

	const [errorState, setErrorState] = useState({ flg: false, msg: "" });

	const [showAlert, setAlert] = useState(false);
	const [blockingOverlay, setBlockingOverlay] = useState(false);
	const [bRedirectToWallets, setRedirectToWallets] = useState(false);


	const { state } = useContext(loginStatusContext);

	useEffect(() => {
	if(state.flg)
	{
		setExpenseInfo({ ...expenseinfo, userID: state.userid });
		setBlockingOverlay(true);
		fetchAccounts();
	}
	else
	{
		hist.push("/signin");
	}
	}, []);


	const fetchAccounts = () => {
		axios.post('/fetchaccounts', {userId: state.userid})
		.then(res => {
			setBlockingOverlay(false);
			console.log(res.data);
			if(!res.data || res.data.length == 0)
			{
				setRedirectToWallets(true);
			}
			else
			{
				setRedirectToWallets(false);
				setAccounts(res.data);
			}
		})
		.catch(err => {
			setBlockingOverlay(false);
			console.log("Fetch accounts error");
			console.log(err);
		})
	}
  
	const validateData = () => {
		if(expenseinfo.date == "" || expenseinfo.itemname == "" || expenseinfo.currency == "" 
			|| expenseinfo.amount == "" || (expenseinfo.account == null && accounts != null && accounts.length > 0))
			{
				return false;
			}
			return true;
	}

	const getFormData = () =>{
		const fd = new FormData();
		
		fd.append("userID", expenseinfo.userID)
		fd.append("date", expenseinfo.date)
		fd.append("itemname", expenseinfo.itemname)
		fd.append("currency", expenseinfo.currency)
		fd.append("amount", expenseinfo.amount)
		
		if(expenseinfo.expenseImage != null && expenseinfo.expenseImage != "")
			fd.append("expenseImage", expenseinfo.expenseImage)
		
		fd.append("expenseType", expenseinfo.expenseType)
    	fd.append("account", expenseinfo.account)
		return fd;
	}

  const submitHandler = (e) => {
    e.preventDefault();

	if(!validateData())
	{
		setErrorState({ flg: true, msg: strings.ERROR_REQUIRED_FIELDS });
		return;
	}
		
    setBlockingOverlay(true);

    axios.post("/expensesadd", getFormData(),
      {
        headers: {
        "Content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        setBlockingOverlay(false);
        console.log(`>>>>>>>>>>>>>>>>>> ${res.status}`);
        if (res.status === 200) {
          setAlert(true);
          
        }
      })
      .catch((err) => {
        setBlockingOverlay(false);
        switch (err.response.status) {
          case 500:
            setErrorState({ flg: true, msg: strings.ERROR_NO_USER });
            hist.push("/signin");
            break;
          case 401:
            setErrorState({ flg: true, msg: strings.ERROR_UNAUTORISED });
            hist.push("/signin");
            break;
          case 400: 
            console.log(`>>>>>>>>>> ${err.response.status}`);
            setErrorState({ flg: true, msg: strings.ERROR_IMAGE_UPLOAD });
            break;

          default:
            return null;
        }
      });
  };

	const inputHandler = (e) => {
		setErrorState({ flg: false, msg: "" });
		const fieldName = e.target.name;
		let fieldvalue;

		if(fieldName === "expenseImage")
		{ 
			//if image is already attached, unattach it
			if(expenseImageName != "")
			{
				setExpenseInfo({ ...expenseinfo, [fieldName]: null });
				setExpenseImageName("");
				return;
			}
			if(profileImageValidation(e.target.files[0]))
			{
				setExpenseImageName(e.target.files[0].name);
				const reader = new FileReader();
				reader.readAsDataURL(e.target.files[0]);
				reader.onloadend = () => {
					console.log(reader.result);
					setExpenseInfo({ ...expenseinfo, [fieldName]: reader.result });
				}        
			}		
			else
			{
				setErrorState({flg:true, msg: strings.ERROR_IMG_SIZE_EXCEED});
			}
		}
		else
		{
			fieldvalue = e.target.value;
			setExpenseInfo({ ...expenseinfo, [fieldName]: fieldvalue });
		}
	};

	const handleChange = (date) => {
		setErrorState({ flg: false, msg: "" });
		setExpenseInfo({ ...expenseinfo, date: date });
	};

  return state.flg ? (
    <>
    	{
			showAlert && (
				<Alert text="Expense Added" delay={3000} bShowCloseButton={true}/>
			)
		}
		{
			blockingOverlay && (
			<BlockingOverlay showLoader={true}/>
			)
		}
		{
			bRedirectToWallets && (
				<RedirectionDB message={strings.MSG_WALLET_REQUIRED} link={"/accounts"} btnText={"Add a wallet"}/>
			)
		}
		<div className={style.formBox}>
			<h1 className={style.title}>{ strings.TITLE_ADD_DB }</h1>
			{
				errorState.flg && <h5 className={style.alert}>{errorState.msg}</h5>
			}
			<form onSubmit={submitHandler} noValidate>
				
        <div className={style.expenseTypeContainer}>
			<label className={style.expenseTypeLabel}>
				<input type="radio" checked={expenseinfo.expenseType == eExpenseType.income} value={eExpenseType.income} onChange={inputHandler} className={style.expenseTypeInput} name="expenseType"></input>
				
				<span className={style.checkmark}></span>
				Income
			</label>
          
			<label className={style.expenseTypeLabel}>
				<input type="radio" value={eExpenseType.spent} onChange={inputHandler} className={style.expenseTypeInput} name="expenseType"></input>
				
				<span className={style.checkmark}></span>
				Spent
			</label>

			<label className={style.expenseTypeLabel}>
				<input type="radio" value={eExpenseType.invest} onChange={inputHandler} className={style.expenseTypeInput} name="expenseType"></input>
				
				<span className={style.checkmark}></span>
				Investment
			</label>
        </div>

		<Datepicker formatandhandler={{ state: expenseinfo.date, format: "dd/MM/yyyy", view: ["year", "month", "date"], handler: handleChange,}}/>
		
		<div>
			<input 
        		className={style.itemInput} 
				name="itemname" 
				value={expenseinfo.itemname} 
				onChange={inputHandler}  
				placeholder={expenseinfo.expenseType == 0 ? "Item name" : expenseinfo.expenseType == 1 ? "Income source" : "Name"}  
				required>
			</input>
		</div>
			
		<div>
			<select className={style.currencySelectInput} name="currency" onChange={inputHandler}>
            <option aria-label="None" value="">{ strings.CURRENCY + "*"}</option>
            {
                currencies.map(currency =>{
                return <option key={currency.id} value={currency.id}>{currency.value}</option>
                })
            }
			</select>

			<input className={style.amountInput} name="amount" type="number" value={expenseinfo.amount} onChange={inputHandler}  placeholder="Amount"  required></input>
		</div>

        {
          (accounts != null && accounts.length > 0) && (

          <div>
            <select className={style.accountSelectInput} name="account" onChange={inputHandler}>
              <option aria-label="None" value="">{strings.SELECT_ACCOUNT + "*"}</option>
              {
                accounts.map(account =>{
                  return <option key={account._id} value={account._id}>{account.accountName}</option>
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
						<button type="button" title="Attach an image" className={style.expenseImageButton} onClick={()=> inputImageRef.current.click()}>
							<img src={attachIcon} className={style.expenseImageButtonIcon} />
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
          	
            <p className={style.expenseImageName}>{expenseImageName}</p>
        </div>
        

				<button type="submit" className="btnSubmit">{ strings.ADD }</button>
				
      </form>
		</div>		
      </>
  ) : null;
}

export default ExpensesAdd;
