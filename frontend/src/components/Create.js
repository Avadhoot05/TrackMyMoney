import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import axios from 'axios';

import style from '../styles/user.module.css';

import {passwordValidation, emailValidation} from "../utils/validations.js";
import { strings } from '../Strings';
import Alert from './separate components/Alert';



function Create() {



    const [ userInfo, setUserinfo ] = useState({
		"name": "", 
		"email": "", 
		"opswd": "",
		"pswd": "", 
		"cpswd": ""}
	);
    const [ PswdValidate,  setPswdValidation ] = useState(null);
    const [ bEmailValidate, setEmailValidation ] = useState(false);

    const [ errorState, setErrorState ] = useState({flg:false,msg:"", });
	const [showAlert, setShowAlert] = useState({flag: false, text: "", bError: false});

    const hist = useHistory();

	const ResetAlert = () => {
		console.log("reset alert");
		setShowAlert({flag: false, text: "", bError: false});
	}

	const getFormData = () =>{
		const fd = new FormData();
		
		fd.append("name", userInfo.name);
		fd.append("email", userInfo.email);
		fd.append("pswd", userInfo.pswd);
		fd.append("cpswd", userInfo.cpswd);

		return fd;
	}

	const ValidateData = () => {
		if(userInfo.name == "" || userInfo.email == "" || userInfo.pswd == "")
			return strings.ERROR_REQUIRED_FIELDS;

		if(!emailValidation(userInfo.email))
			return "Email is incorrect";

		if(userInfo.pswd != userInfo.cpswd)
			return "Password should match with confirm password";

		return true;
	}

    const submitHandler = e => {
		e.preventDefault();

		let IsValid = ValidateData();
		if(IsValid !== true)
		{
			setShowAlert({flag: true, text: IsValid, bError: true});
			// setErrorState({ flg: true, msg: IsValid});
			return;
		}

		axios.post("/create",  getFormData() ,
		{
			headers: {
			"Content-type": "multipart/form-data",
			},
		})
		.then(res=>{
		if(res.status===200){
			setShowAlert({flag: true, text: "User registered succesfully", bError: false});
			// setErrorState({flg:true ,msg:});
			setTimeout(() => {
				hist.push('/signin');
			}, 2000);
		}   
		})
		.catch(err=>{
			console.log(err.response.status);

			switch (err.response.status) {
				case 420:
					setShowAlert({flag: true, text: "User Already Exists", bError: true});
					// setErrorState({flg:true,msg:"User Already Exists"});
					break;
				case 422:
					setShowAlert({flag: true, text: "All fields are required", bError: true});
					// setErrorState({flg:true,msg:"All fields are required"});
					break; 
				case 500:
					setShowAlert({flag: true, text: "Oops! Something went wrong", bError: true});
					// setErrorState({flg:true,msg:"Oops! Something went wrong"});
					break;
			}      
		})
	}
    
    const inputHandler = e => {
        setErrorState({flg: false, msg: ""});

		const fieldName = e.target.name;
		const fieldvalue = e.target.value;
		
		if(fieldName === "email"){
			setEmailValidation(!emailValidation(fieldvalue));			
		}
        
		else if(fieldName === "pswd"){
			 setPswdValidation(passwordValidation(fieldvalue));
		}
        
		setUserinfo({...userInfo, [fieldName]: fieldvalue});  
    }

    return (
		<>
			{
			showAlert.flag && <Alert text={showAlert.text} delay={3000} bError={showAlert.bError} reset={ResetAlert}/>
			}
			<div className={`${style.formBox} ${style.createFormBox}`}>
				<h1 className={style.title}>Create Account</h1>
				{/* {
					errorState.flg && (<h5 className={style.alert}>{errorState.msg}</h5>)
				} */}
				<form onSubmit={submitHandler} noValidate>
					
					<div className="input-box">
						<input 
							name="name" type="text" placeholder="Your Name" id="firstName" onChange={inputHandler} value={userInfo["name"]}  required>   
						</input>
					</div>

					<div className="input-box">
						<input 
							name="email" placeholder="Email Id" id="email" type="email" onChange={inputHandler} value={userInfo["email"]} required>
						</input>
						{
							bEmailValidate && <h6 className={style.pswdwarning}>Enter a valid email</h6>
						}
					</div>

					
					
					<div className={style.inputBox}>
						<input  
							className={`${PswdValidate == 0 && style.weakPswd} ${PswdValidate == 0.5 && style.midPswd} ${PswdValidate == 1 && style.strongPswd}`} 
							placeholder="Password" name="pswd" onChange={inputHandler} value={userInfo["pswd"]} type="password" id="password" required>
						</input>
						{
							PswdValidate == 0 && <p className={style.passwordStrength}>Weak</p>
						}
						{
							PswdValidate == 0.5 && <p className={style.passwordStrength}>Medium</p>
						}
						{
							PswdValidate == 1 && <p className={style.passwordStrength}>Strong</p>
						}
					</div>

					<div className="input-box">
						<input 
							name="cpswd" placeholder="Confirm Password" onChange={inputHandler} type="password" value={userInfo["cpswd"]} id="cpassword" required>
						</input>
					</div>

					<div className="input-box">
					<button type="submit" className={style.btnSubmit}>Create</button>
					</div>
				</form>
				
				<>
					<hr></hr>
					<div className="signin-redirect-box">
						<h6 className={style.accountsuggest}>Already have an account?</h6>
						<NavLink className={style.accountsuggestlink} to="/signin">Sign in</NavLink>
					</div> 
				</>
					
			</div>
		</>
    )
}

export default Create




