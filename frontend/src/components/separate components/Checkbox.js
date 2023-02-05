import style from '../../styles/Checkbox.module.css'
import React from 'react';


function Checkbox(props) 
{
    const { name, bChecked, onChangeHandler } = props;

    return (
        <>
            <input className={style.checkbox} type='checkbox' name = {name} checked={bChecked} onChange={onChangeHandler}></input>
            <span className={style.checkmark}></span>	
        </>		
    )
}

export default Checkbox;