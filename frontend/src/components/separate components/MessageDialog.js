import React from 'react';
import style from '../../styles/MessageDialog.module.css';

function MessageDialog(props) {
  return (
    <div className={style.container}>
        <p className={style.message}>{props.message}</p>
        {
            props.btn1Text && <button className={style.btn} onClick={props.btn1Handler}>{props.btn1Text}</button>
        }
        {
            props.btn2Text && <button className={style.btn} onClick={props.btn2Handler}>{props.btn2Text}</button>
        }
    </div>
  )
}

export default MessageDialog;