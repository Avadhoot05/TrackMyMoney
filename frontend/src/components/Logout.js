import React, {useEffect,useContext, useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import {loginStatusContext} from '../App';
import BlockingOverlay from './separate components/BlockingOverlay';
 
function Logout() {

    const { dispatch,} = useContext(loginStatusContext);
    const [blockingOverlay, setBlockingOverlay] = useState(false);
    const [bLogoutSuccess, setLogoutSuccess] = useState(false);

    const hist  = useHistory()
    const logoutHandler =  ()=>{
        console.log("log out")
        setBlockingOverlay(true);
        axios.get('/logout',{
                            headers:{
                            "Content-Type":"application/json"
                            },
                            withCredentials:"include"
                })
                .then(response => {
                    setBlockingOverlay(false);
                    if(response.status == 200)
                    {
                        dispatch({type:'USER_OK',payload:{flg:false,name:null}});
                        setLogoutSuccess(true);

                        setTimeout(() => {
                            setLogoutSuccess(false);
                            hist.push('/');   
                        }, 2000);
                    } 
                    else alert("Logout failed")
                })
                .catch(error => setBlockingOverlay(false));
    }

    useEffect(() => {
        logoutHandler();
    }, [])

    return (
        <>
        {
          blockingOverlay && (
            <BlockingOverlay showLoader={true}/>
          )
        }
        {
            bLogoutSuccess && <div>You have been logged out.</div>
        }
        </>
    )
}

export default Logout
