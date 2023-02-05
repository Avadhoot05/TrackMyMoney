import React from 'react';
import { useState, useContext } from 'react';
import { loginStatusContext } from "../App";

import { strings } from '../Strings';

import style from "../styles/AccountDeleteDb.module.css";
import cross from '../media/cross.png'
import axios from 'axios';
import Alert from './separate components/Alert';

const AccountDeleteType = {
    delete: 1,
    transferAndDelete: 2
}

function AccountDeleteDb(props) {
    let { accounts, accountDeleteId, hideDialog, updateAccountListAfterDelete } = props;
    
    const [ accountToTransferAt, setAccountToTransferAt ] = useState("-1");
    const [ error, setError ] = useState({flag: false, msg: ""});

    const { state } = useContext(loginStatusContext)

    const userId = state.userid

    const accountToDelete =  accounts.filter(acc => acc.id == accountDeleteId);

    accounts = accounts.filter(acc => acc.id != accountDeleteId);
    console.log(accounts);

    const sendDeleteRequest = data => {
        axios.post('deleteuseraccount',data)
        .then(res => {
            console.log(res);
            if(res.status == 200){
                if(data.accountDeleteType == AccountDeleteType.delete){
                    <Alert text="Account deleted" delay={3000}/>
                }
                else{
                    console.log(`${res.data.modifiedCount} transactions tranfered`)
                }
            }
            hideDialog();
            updateAccountListAfterDelete();
        })
        .catch(e => {
            <Alert text="Account could not be deleted" delay={3000}/>
            hideDialog();
        })
    }

    const deleteAndEraseData = () => {
        sendDeleteRequest({
            accountDeleteType:  AccountDeleteType.delete,
            userId: userId,
            accountDeleteId: accountDeleteId
        });
    }

    const deleteAndTransfer = () => {
        if(accountToTransferAt == "-1"){
            setError({flag: true, msg: "Account is not selected"});
            return;
        }

        sendDeleteRequest({
            accountDeleteType:  AccountDeleteType.transferAndDelete,
            userId: userId,
            accountDeleteId: accountDeleteId,
            accountTransferId: accountToTransferAt
        });
    }


    const inputHandler = e => {
        console.log(e.target.value)
        setAccountToTransferAt(e.target.value);
        setError({flag: false, msg: ""});
    }  
    

    return (
        <>
            <div className={style.blurredBackOverlay}></div>
            <div className={`${style.dialogContainer} ${accounts.length == 0 && style.adjustHeight}`}>
                <img onClick={()=>hideDialog()} src={cross} className={style.cross} alt="close"></img>
                {
                    accounts.length == 0 ? (
                        <p>The data related to <span>{accountToDelete[0].accountName}</span> will be lost permanantly.
                        </p>
                    ) : (
                        <>
                            <p>Select any wallet to transfer the transactions related to <span>{accountToDelete[0].accountName}</span>. Clicking on Delete will erase the data permanantly.</p>
            
                            <div className={style.selectContainer}>
                            {
                                error.flag && <p className={style.error}>{ error.msg }</p>
                            }
                                <select className={style.accountSelectInput} name="account" onChange={inputHandler}>
                                    <option aria-label="None" value="-1">{strings.SELECT_ACCOUNT + "*"}</option>
                                    {
                                        accounts.map(account =>{
                                        return <option key={account.id} value={account.id}>{account.accountName}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </>
                    )
                }
                
                <div className={style.btnContainer}>
                    <button className={`${accountToTransferAt != "-1" && style.disable}`} onClick={deleteAndEraseData}>Delete</button>
                    {
                        accounts.length != 0 && <button  onClick={deleteAndTransfer}>Transfer and Delete</button>
                    }
                    
                </div>
            </div>
        </>
    )
}

export default AccountDeleteDb
