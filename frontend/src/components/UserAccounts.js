import axios from 'axios';
import React, {useState, useEffect, useContext, useRef} from 'react'
import { useHistory } from "react-router";

import { loginStatusContext } from "../App";
import { strings } from '../Strings';

import style from "../styles/Accounts.module.css"


import crossIcon from "../media/cross.png";
import trashIcon from "../media/trash.png";

import { VscAdd } from "react-icons/vsc";
import AccountDeleteDb from './AccountDeleteDb';

function UserAccounts() 
{
    const hist  = useHistory()
    const inputRef = useRef(null) 

    const { state } = useContext(loginStatusContext)

    const userId = state.userid
    const [data, setData] = useState({accounts: [], userId: null})
    
    const [existingAccounts, setExistingAccounts] = useState([]);
    const [accountDeleteId, setAccountDeleteId] = useState(null);

    const [error, setError] = useState({flag: false, msg: ""});
    const [inputError, setInputError] = useState({flag: false, msg: ""});
    const [formVisibility, setFormVisibility] = useState(false);
    
    const submitRef = useRef(null)

    useEffect(() => {
        if(state.flg)
        {
            setData({ ...data, userId: state.userid })
            fetchAccounts()
        }
        else{
            hist.push("/signin");
        }
    }, [])

    const pickAccountNames = data => {
        let Names = []

        for (const account of data) {
            Names.push({accountName: account.accountName ,id: account._id})
        }
        console.log(Names)
        return Names
    }

    const fetchAccounts = () =>{
        console.log(userId)
        axios.post('/fetchaccounts', {userId})
        .then(res => {
            console.log("Fetch Accounts")
            const responseName = pickAccountNames(res.data)
            setExistingAccounts([ ...responseName])
        })
        .catch(err => {
            console.log("Fetch accounts error")
            console.log(err)
        })
    }

    const inputHandler = e => {
        setInputError({flag: false, msg: ""})
    }

    const toggleForm = () => {
        setData({...data, accounts: []})
        setFormVisibility(!formVisibility)
    }

    const AccountExists = name => {
        for (const i of data.accounts) {
            if(name.replaceAll(" ", "").toLowerCase() === i.replaceAll(" ", "").toLowerCase())
            {
                setInputError({flag: true, msg: strings.ERROR_ACCOUNT_NAME_EXISTS})
                return true
            } 
        }
    
        for (const i of existingAccounts) {
            if(name.replaceAll(" ", "").toLowerCase() === i.accountName.replaceAll(" ", "").toLowerCase())
            {
                setInputError({flag: true, msg: strings.ERROR_ACCOUNT_NAME_EXISTS})
                return true
            } 
        }

        return false
    } 
    

    const addHandler = e =>{
        const name = inputRef.current.value
        if(!name.length)
        {
            setInputError({flag: true, msg: "Name" + strings.WARNING_EMPTY_INPUT})
            return
        }
        inputRef.current.value = "";
        

        if(AccountExists(name))
            return

        setData({...data, accounts: [...data.accounts, name]})
        
    }

    const updateExistingAccounts = () =>{
        setExistingAccounts([...existingAccounts, ...data.accounts])
        
    }

    const removeAccount = index => {
        //remove data[index]
        const accounts = data.accounts
        accounts.splice(index,1)
        setData({...data, accounts: accounts})
    }

    const deleteAccount = accountId => {
        console.log("delete ID");
        console.log(accountId);

        setAccountDeleteId(accountId);
    }

    const updateAccountListAfterDelete = () => {
        setExistingAccounts(existingAccounts.filter(acc => acc.id != accountDeleteId));
    }

    const hideDialog = () => {
        setAccountDeleteId(null);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        
        axios.post('useraccount', {data})
        .then(res => {
            switch(res.status)
            {
                case 200:   fetchAccounts();
                            setData({...data, accounts: []})
                            break
            }
        })
        .catch(err => {

        })
    }

    return (
        <>
        {
            error.flag && (
                <h1>{error.msg}</h1>
            )
        }

        {
            accountDeleteId != null && <AccountDeleteDb accounts={existingAccounts} accountDeleteId={accountDeleteId} hideDialog={hideDialog} updateAccountListAfterDelete={updateAccountListAfterDelete}/>
        }
        
        {
            formVisibility && (
                <div className={style.container}>
                    <div className={style.formContainer}>
                        <form onSubmit={submitHandler} noValidate>
                            <div className={style.inputBox}>
                                <div>
                                    <input className={style.nameInput} placeholder='Wallet Name' ref={inputRef} onChange={inputHandler} required></input>
                                    {
                                        inputError && (
                                            <p className={style.errorMsg}>{ inputError.msg }</p>
                                        )
                                    }
                                </div>
                                {/* <button type="button" className={style.button}  onClick={addHandler}><img src={addIcon} className={style.addButtonIcon}/></button> */}
                                <VscAdd title='Add an account' size="45" color="white" onClick={addHandler} className={style.addButtonIcon}/>
                            </div>
                            <button  className={style.hide} ref={submitRef} type='submit'></button>
                        </form>
                        {
                            data.accounts.length !=0 && (
                                <div className={style.newAccountsContainer}>
                                {
                                    (
                                    data.accounts.map((account, index) => {
                                        return (
                                            <div key={index} className={style.newAccountItem}>
                                                <p className={style.newAccountName}>{account}</p>
                                                <img title="Erase this name" src={crossIcon} className={style.crossButton} onClick={() => removeAccount(index)}></img>
                                            </div>
                                        ) 
                                    })
                                    )
                                }
                            </div>
                            )
                        }
                    
                    </div>
                    <div className={`${style.ButtonContainer} ${style.saveButtonContainer}`}> 
                        <button type="submit" className={`${style.saveButton} ${(data.accounts == null || !data.accounts.length) && style.disabled}`} onClick={()=> submitRef.current.click()}>Save</button>
                        <button type="button" className={style.saveButton} onClick={toggleForm}>Cancel</button>
                    </div>
                </div>
                )
        }
        

            <div className={`${style.secondContainer} ${formVisibility && style.secondContainerMarginTop}`}>
                
                    
                        <div className={style.ButtonContainer}>
                            <h2 className={style.existingAccountHeading}>Existing Wallets</h2>
                            
                            {
                                !formVisibility && (
                                    <button className={style.btn} onClick={toggleForm}>
                                        <VscAdd className={style.marginRight}/>
                                        Add
                                    </button>
                                    //<button className={style.newButton} >Add New</button>
                                )
                            }
                            
                        </div>
                    
                
                        <hr></hr>
                <div className={style.existingAccountsContainer}>
                    { 
                        existingAccounts != null && existingAccounts.length ? 
                        (
                            existingAccounts.map((account, index) => {
                                return (
                                        <div key={index} className={style.accountItem}>
                                            <p className={style.accountName}>{account.accountName}</p>
                                            <img title="Delete this account" src={trashIcon} className={style.trashButton} onClick={() => deleteAccount(account.id)}></img>
                                        </div>
                                )
                            })
                        )  : 
                        (   
                            data.accounts.length == 0 && <p>No Wallets</p>
                        )
                    }
                </div>
            </div>
            
            
        
        </>
    )
}

export default UserAccounts;
