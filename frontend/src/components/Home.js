import { useContext} from 'react';

// import 'bootstrap/dist/css/bootstrap.min.css';
import banner from '../media/banner.webp';
import style from '../styles/Home.module.css';
import { NavLink } from 'react-router-dom';
 
import { AiFillLinkedin } from "react-icons/ai";
import { SiLeetcode } from "react-icons/si";
import { CgWebsite } from "react-icons/cg";
import { MdEmail } from "react-icons/md";
import { loginStatusContext } from '../App';

function GetName(state) {
	return (
		<>
			<div className={style.titleContainer}>
				<p className={style.welcome}>
					Welcome
				</p>
				<br></br>
				<h1 className={style.title}>
					{state.name}
				</h1>
			</div>
		</>
	)
} 

function GetSignInUI() {
	return (
		<>
		<div className={style.titleContainer}>
			<h1 className={style.title}>
				Track<br></br>My Money
			</h1>
			<p className={style.desc}>
				Manage all kinds of your daily expenses with ease...  
			</p>
			<div className={style.links}>
				<NavLink to="/signin" className={style.login}>Sign in</NavLink>
				<p>or</p>
				<NavLink to="/create" className={style.login}>Register</NavLink>
			</div>
		</div>
		</>
	);
}

function Home() {

	const { state } = useContext(loginStatusContext);
	return (
		<>
		{
			<div className={style.container}>
				<div className={style.banner}>
					{
						state.flg ? (GetName(state)) : (GetSignInUI())
					}
					<div>
						<img src={banner} className={style.bannerimg}></img>
					</div>
				</div>
					<svg className={style.wave} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
						<path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
					</svg>
				<div className={style.featuresContainer}> 
					<div className={style.features}>
						<div>
							<h3>Transactions</h3>
							<p>Add, Delete, edit any kind of transaction in USD/INR with attached reference image.</p>
						</div>
						<div>
							<h3>Multiple wallets</h3>
							<p>Manage all of your online/offline transactions by creating multiple wallets.</p>
						</div>
						<div>
							<h3>Currency converter</h3>
							<p>Realtime currency converter that supports 20+ currencies.</p>
						</div>
					</div>
				</div>
				<div className={style.myInfoContainer}>
					<p className={style.myInfo}>Reach out the developer.</p>
					<div className={style.myInfoLinks}>
						<NavLink className={style.iconLinks} to={{pathname: "https://avadhootkhedekar.com"}} target="_blank">
							<CgWebsite title="Developer's website" className={style.icons} size={25}/>
						</NavLink>
						
						<NavLink className={style.iconLinks} to={{pathname: "https://www.linkedin.com/in/avadhootkhedekar/"}} target="_blank">
							<AiFillLinkedin title="Developer's Linkedin" className={style.icons} size={25}/>
						</NavLink>
	
						<NavLink className={style.iconLinks} to={{pathname: "mailto: khedekaravadhoot@gmail.com"}} target="_blank">
							<MdEmail title="Developer's Email" className={style.icons} size={25}/>
						</NavLink>
	
						<NavLink className={style.iconLinks} to={{pathname: "https://leetcode.com/avadhoot05/"}} target="_blank">
							<SiLeetcode title="Developer's LeetCode" className={style.icons} size={25}/>
						</NavLink>
	
					</div>
					
				</div>
			</div>}
		
		</>
	);
}

export default Home;
