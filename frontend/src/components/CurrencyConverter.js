
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BlockingOverlay from './separate components/BlockingOverlay';

import style from "../styles/CurrencyConverter.module.css";
import cross from '../media/cross.png';
import copy from '../media/copy.png';
import tick from '../media/tick.png';


function CurrencyConverter(props) {
    const [latestRates, setLatestRates] = useState({});
    const [copyState, setCopyState] = useState({
        "input_one": false, 
        "input_two": false
    });
    
    useEffect(function(){
        axios.get('http://data.fixer.io/api/latest?access_key=5ccc18623852221c413d079181cc8cfa&format=1')
        .then(response => {
            setLatestRates(response.data)
        })
        .catch(error => {
            console.log(`Error>> ${error}`);
        })
    }, []);
    
    var timer;
    const HandleChange = e => {
        setCopyState({
            "input_one": false, 
            "input_two": false
        });

        clearTimeout(timer);
        
        timer = setTimeout(() => {
            let selectedOne = document.getElementById("currency_select_one").value;
            let selectedTwo = document.getElementById("currency_select_two").value;
            
            axios.get('http://data.fixer.io/api/latest?access_key=5ccc18623852221c413d079181cc8cfa&format=1')
            .then(response => {
                //console.log(response);
            
                if(e.target.id == 'currency_input_one' || e.target.id == 'currency_select_two')
                {
                    let SourceInputValue = document.getElementById('currency_input_one').value;
                    document.getElementById("currency_input_two").value = GetConvertedData(response.data.rates, SourceInputValue, selectedOne, selectedTwo);
                    return;
                }
                if(e.target.id == 'currency_input_two' || e.target.id == 'currency_select_one')
                {
                    let SourceInputValue = document.getElementById('currency_input_two').value;
                    document.getElementById("currency_input_one").value = GetConvertedData(response.data.rates, SourceInputValue, selectedTwo, selectedOne);
                    return;
                }
            })
            .catch(error => {
                console.log(`Error>> ${error}`);
            })
            
        }, 100);
    }

    const GetConvertedData = (data, amount, source, target) => {
        console.log(data);
        console.log(source);
        console.log(target);
        console.log("-------------")
        let sourceAmt = data[source];
        let targetAmt = data[target];  
        
        return (amount * targetAmt) / sourceAmt; 
    }

    const copyText = (copyText, callback) => {
        navigator.clipboard.writeText(copyText).then(() => {
            callback();
        });
    }

    const onCopy = e => {
        if(e.target.id == "copy_input_one")
        {
            let text = document.getElementById("currency_input_one").value;

            copyText(text, function(){
                setCopyState({
                    "input_one": true, 
                    "input_two": false
                });
            });
            return;
        }
        if(e.target.id == "copy_input_two")
        {
            let text = document.getElementById("currency_input_two").value;
            copyText(text, function(){
                setCopyState({
                    "input_one": false, 
                    "input_two": true
                });
            });
        }
    }

    return (
        <>
        <BlockingOverlay showLoader={false}/>
        <div className={style.container}>
            <img onClick={()=>props.toggleCurrencyConverter()} src={cross} className={style.cross} alt="close"></img>
            <h2 className={style.heading}>Convert</h2>
            <div className={style.input_container}>
                <select className={style.curreny_select} id="currency_select_one" onChange={HandleChange}>
                    {
                        latestRates.rates && 
                        ( 
                            Object.keys(latestRates.rates).map( (currency, index) => {
                                return <option key={index} value={currency}>{currency}</option>
                            })
                        )
                    }
                </select>
                <div className={style.input_box}>
                    <input className={style.currency_input} type="number" id="currency_input_one" onChange={HandleChange}></input>
                    {
                        window.isSecureContext && (
                            (document.getElementById("currency_input_one") && document.getElementById("currency_input_one").value != "") && (
                                <img className={style.copy} title={`${copyState.input_one ? "copied" : "copy"}`} id="copy_input_one" src={`${copyState.input_one ? tick :copy}`} onClick={onCopy}></img>
                            )
                        )
                    }
                </div>
            </div>

            <div className={style.input_container}>
                <select className={style.curreny_select} id="currency_select_two" onChange={HandleChange}>
                    {
                        latestRates.rates && (
                        Object.keys(latestRates.rates).map( (currency, index) => {
                            return <option key={index} value={currency}>{currency}</option>
                        }))
                    }
                </select>
                <div className={style.input_box}>
                    <input className={style.currency_input} type="number" id="currency_input_two" onChange={HandleChange}></input>
                    {
                        window.isSecureContext && (
                            (document.getElementById("currency_input_two") && document.getElementById("currency_input_two").value != "") && (
                                <img className={style.copy} title={`${copyState.input_two ? "copied" : "copy"}`} id="copy_input_two" src={`${copyState.input_two ? tick : copy}`} onClick={onCopy}></img>
                            )
                        )
                    }
                </div>
                
            </div>
        </div>
        </>
    )
}

export default CurrencyConverter