import React,{useContext, useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';
import {loginStatusContext} from '../App';

import CurrencyConverter from '../components/CurrencyConverter';

import style from '../styles/nav.module.css';

import dropdown from '../media/dropdown.png';
import hamburger from '../media/ham.png';
import cross from '../media/cross.png';
    
function Nav() {

    const {state,} = useContext(loginStatusContext);
    const [ShowProfileOptions, setProfileOptions] = useState(false);
    const [ShowMobileNav, setMobileNav] = useState(false);

    const [bShowCurrencyConverter, setShowCurrencyConverter] = useState(false);

	const toggleCurrencyConverter = () => {
		setShowCurrencyConverter(!bShowCurrencyConverter);
	}

    const ToggleMobileNav = () => {
        setMobileNav(!ShowMobileNav);
    }

    const ToggleProfileOptions=()=>{
        console.log("profile clicked")
        setProfileOptions(!ShowProfileOptions)
    }

    useEffect(() => {
        const clickHandler = () =>{
            setProfileOptions(!ShowProfileOptions)
            document.body.removeEventListener("click",clickHandler);
        }

        if(ShowProfileOptions){
            document.body.addEventListener("click",clickHandler)
        }
        
    }, [ShowProfileOptions])

    

    return (
        <>
        {
			bShowCurrencyConverter && (
					<CurrencyConverter toggleCurrencyConverter={toggleCurrencyConverter}/>
			)
		}
        <div className={style.navcontainer} >
            <div className={style.logoContainer}>

            </div>
            <div className={`${style.menuContainer} ${ShowMobileNav && style.MobileMenuContainer}`}>
                <img loading='lazy' onClick={ToggleMobileNav} className={style.navClose} src={cross}></img>
                <ul className={`${style.navlist} ${ShowMobileNav && style.MobileNavlist}` }>
                    <li onClick={ToggleMobileNav} className={style.listitem}>
                        <NavLink to="/home" className={style.listitem} >home</NavLink>
                    </li>
                    {
                    state.flg ? 
                        (
                            <>
                                <li onClick={ToggleMobileNav} className={style.listitem}>
                                    <NavLink to="/expenseslist" className={style.listitem}>transactions</NavLink>
                                </li>
                                <li onClick={ToggleMobileNav} className={style.listitem}>
                                    <NavLink to="/expensesadd" className={style.listitem}>add</NavLink>
                                </li>
                                <li onClick={ToggleMobileNav} className={style.listitem}>
                                    <NavLink to="/wallets" className={style.listitem}>wallets</NavLink>
                                </li>
                            </> 
                        ) : 
                        (
                            <>
                                <li onClick={ToggleMobileNav} className={style.listitem}>
                                    <NavLink to="/signin" className={style.listitem}>Sign in</NavLink>
                                </li>
                                <li onClick={ToggleMobileNav} className={style.listitem}>
                                    <NavLink to="/create" className={style.listitem}>Register</NavLink>
                                </li>
                            </>
                        )
                    } 
                </ul>
            </div>
            {
                state.flg &&
                <div className={style.ProfileNavlistContainer}>
                    <ul className={style.ProfileNavlist}>
                        <li onClick={ToggleProfileOptions} className={`${style.listitem} ${style.avtarListItem}`}>
                            {/* <img className={style.avatar} src={avatar} ></img> */}
                            <div className={style.avatar}>{state.name[0]}</div>
                            <img loading='lazy' className={style.expandArrow} src={dropdown} ></img>

                            <div className={`${style.profileOptions} ${ShowProfileOptions && style.showProfile}`}>
                                <ul className={style.profileOptionsNavlist}>
                                    {/* <li className={style.profileOptionsListItem}>
                                        <NavLink to="/edit-profile">edit&nbsp;profile</NavLink>
                                    </li> */}

                                    <li className={`${style.profileOptionsListItem} ${style.CurrencyConverterListItem}`} onClick={toggleCurrencyConverter}>
                                        Currency&nbsp;Converter
                                    </li>
                                    <li className={style.profileOptionsListItem}>
                                        <NavLink to="/insights">Insights</NavLink>
                                    </li>
                                    <li className={style.profileOptionsListItem}>
                                        <NavLink to="/logout">log&nbsp;out</NavLink>
                                    </li>
                                    <li className={style.profileOptionsListItem}>
                                        <NavLink to={{pathname: "https://avadhootkhedekar.com"}} target="_blank">about&nbsp;developer</NavLink>
                                    </li>
                                    
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            }
            
            <div className={style.hamMenuContainer}>
                <img loading='lazy' onClick={ToggleMobileNav} className={style.ham} src={hamburger}></img>
            </div>
        </div>
        </>
    )
}

export default Nav;







// <>
// <nav className="navbar navbar-expand-lg navbar-light bg-light">

// <div class="row justify-content-between">
//     <div className="col-4">
//         <NavLink to="/" className="navbar-brand" >Home</NavLink>
//     </div>
//     <div className="col-4">
        
//         <ul className="navbar-nav">

//             {/* if user logged in then show logout button otherwise login and signup button */}
//             {
//             state.flg?
//             <>
            
//             <li className="nav-item">
//                 <NavLink to="/expenseslist" className="nav-link">Expenses List</NavLink>
//             </li>
//             <li className="nav-item">
//                 <NavLink to="/expensesadd" className="nav-link">Expenses Add</NavLink>
//             </li>

            
//                 <li className="nav-item">
//                     <NavLink to="/logout" className="nav-link">Log out</NavLink>
//                 </li>
                
//             </>
//             :(  
//             <>
//                 <li className="nav-item active">
//                     <NavLink to="/signin" className="nav-link">Login</NavLink>
//                 </li>
//                 <li className="nav-item"> 
//                     <NavLink to="/create" className="nav-link">Sign up</NavLink>
//                 </li> 
//             </>
//             )
//             } 
//         </ul>
    
//     </div>

//     <div className="col-4">
//         <ul>
//             <li className={`nav-item ${style.username}`}>
//                 <h5 className={style.username}>{state.name}</h5>
//             </li>
//         </ul>
//     </div>

//     </div>
// </nav>
// </>



