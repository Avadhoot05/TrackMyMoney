import React, { useEffect, useState, useContext } from 'react';
import Create from './Create';

import axios from 'axios';

import { loginStatusContext } from "../App";


function EditProfile() {
    const { state } = useContext(loginStatusContext);

    const [ userInfo, setUserinfo ] = useState({
        "userId": "",
		"name": "", 
		"email": "", 
		"opswd": "",
		"pswd": "", 
		"cpswd": ""}
	);

    useEffect(function(){
        if(state.flg)
        {
            setUserinfo({...userInfo,
                "name": state.name, 
                "email": state.email, 
            })
        }
    }, []);

    const SubmitHandler = (user) => {
        setUserinfo({...user, "userId": state.userid});
        
        axios.post('/edituser', {...user, "userId": state.userid})
        .then(res => {
            console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <>
        {
            (userInfo.name != "" && userInfo.email != "") && (
                <Create mode="2" userInfo={userInfo} onSubmit={SubmitHandler}/>
            )
        }
        </>
        
    )
}

export default EditProfile