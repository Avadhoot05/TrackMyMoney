import React, {useState, useContext} from 'react';
import {NavLink, useHistory} from 'react-router-dom';

import BlockingOverlay from './separate components/BlockingOverlay';
import Alert from './separate components/Alert';

import { loginStatusContext } from '../App';

import axios from 'axios';

import showPasswordIcon from '../media/eye.png';
import hidePasswordIcon from '../media/hide.png';

import style from '../styles/user.module.css';

function Signin() {

    const {dispatch,} = useContext(loginStatusContext)

    const hist = useHistory()
    const [credentials, setCredentials] = useState({email:"", pswd:""});
    const [showAlert, setShowAlert] = useState({flag: false, text: "", bError: false});
    const [warning, setWarning] = useState({flag: false, text: ""});
    const [blockingOverlay, setBlockingOverlay] = useState(false);

    const ResetAlert = () => {
      console.log("reset alert");
      setShowAlert({flag: false, text: "", bError: false});
    }


    const submitHandler = e => {
        e.preventDefault();
        setShowAlert({flag: false, text: "", bError: false});
        
        if(!credentials.email.length || !credentials.pswd.length)
		    {
          console.log("error");
          setShowAlert({flag: true, text: "Fill all the details", bError: true});
          return;
        }

        setBlockingOverlay(true);

        axios.post("/signin",credentials)
        .then(res=>{
            setBlockingOverlay(false);

            if(res.status===200)
            {
				console.log(res.data);
                dispatch({
                	type: 'USER_OK',
					payload: {
						flg: true,
						userid: res.data._id, 
						name: res.data.name, 
						email: res.data.email
					}});
                console.log("Login Sucessful");
                hist.push('/');
            } 
        })
        .catch(err=>{
          setBlockingOverlay(false);
            switch (err.response.status) 
			{
                case 420:
					console.log(err.response)
                    setShowAlert({flag: true, text: "Invalid Credentials", bError: true});
                    break;
                
                case 500:
					console.log(err.response)
                    setShowAlert({flag: true, text: "Something went wrong", bError: true});
                    break;
                default:
                    return null
            }    
        })
    }
               
    const inputHandler = e=>{
        setShowAlert({flag: false, text: ""});
        setWarning({flag: false, text: ""});
        setCredentials({...credentials, [e.target.name]:e.target.value})
    }

    const TogglePasswordVisibility = e => {
      const pswdInput = document.getElementsByClassName('password')[0];
      const pswdtoggleIcon = document.getElementsByClassName('pswdToggle')[0];
      
      if(pswdInput.type == 'text')
      {
        pswdInput.type = 'password';
        pswdtoggleIcon.src = showPasswordIcon;
      } 
      else{
        pswdInput.type = 'text';
        pswdtoggleIcon.src = hidePasswordIcon;
      } 
    }


    return (
      <>
        {
          showAlert.flag && <Alert text={showAlert.text} delay={3000} bError={showAlert.bError} reset={ResetAlert}/>
        }
        {
          blockingOverlay && (
            <BlockingOverlay showLoader={true}/>
          )
        }
        
        <div className={style.formBox}>
        <h1 className={style.title}>Sign in</h1>
        <form onSubmit={submitHandler} noValidate>
          
          <div className={style.inputBox}>
          {
            warning.flag && <p className={style.warning}>{warning.text}</p>
          }
            <input
              name="email" value={credentials.email}  onChange={inputHandler} placeholder="Email" type="email" required>
            </input>
          </div>

          <div className={style.inputBox}>
            <input
              name="pswd" value={credentials.pswd} className="password"  placeholder="Password" onChange={inputHandler} type="password" required>
            </input>
            <img className={`${style.pswdToggle} pswdToggle`} src={showPasswordIcon} onClick={TogglePasswordVisibility}></img>
          </div>

          <div className={style.inputBox}>
            <button type="submit" className={style.btnSubmit}>Sign in</button>
          </div>
        </form>
        <hr></hr>
        <div className={style.inputBox}>
          <h6 className={style.accountsuggest}>Don't have an account?</h6>
          <NavLink className={style.accountsuggestlink} to="/create">Create one</NavLink>
        </div>
        </div>

 
      </>
    );
}

export default Signin;