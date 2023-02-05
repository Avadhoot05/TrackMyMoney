import React, {useState} from 'react';

import style from "../../styles/Alert.module.css";
//text to show on alert
//time till alert has to be displayed
//to show close button or not

function Alert({text, delay, bShowCloseButton, bError, reset}){
    console.log("Alert")
    console.log(text)
    console.log(delay)
    const [bCloseAlert, setCloseAlert] = useState(false);

    if(delay > 0){
        setTimeout(()=>{
            reset();
            setCloseAlert(true);
        }, delay)
    }
    
    return (
        <div className={`${style.alertBox} ${bCloseAlert ? style.alertBoxSlideUp: style.alertBoxSlideDown} ${bError ? style.error: style.normal}`}>
            <p className={style.text}>{text}</p>
            {/* {
                bShowCloseButton && (
                    <img className={style.close} src={cross} onClick={()=>{setCloseAlert(true)}}></img>
                )
            } */}
        </div>
    )
}

export default Alert 
