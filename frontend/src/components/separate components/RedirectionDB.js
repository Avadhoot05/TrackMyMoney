import React from 'react';
import style from "../../styles/AccountDeleteDb.module.css";
import { NavLink } from 'react-router-dom';


function RedirectionDB(props) {

  return (
        <>
            <div className={style.blurredBackOverlay}></div>
            <div className={`${style.dialogContainer} ${style.RedirectionDBContainer}`}>
                <p>{props.message}</p>
                <NavLink to={props.link} className={style.RedirectionDBlink}>{props.btnText}</NavLink>
            </div>
        </>
    )
}

export default RedirectionDB