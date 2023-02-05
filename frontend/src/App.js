import './App.css';
import React, {useReducer} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Nav from './components/Nav';

import Home from './components/Home';
// import Create from './components/Create';
// import Signin from './components/Signin';
// import ExpensesList from './components/ExpensesList';
// import ExpensesAdd from './components/ExpensesAdd';
// import Insights from './components/Insights';
import Logout from './components/Logout';

import {LoginStatusReducer} from './components/reducers/LoginStatusReducer';
import BlockingOverlay from './components/separate components/BlockingOverlay';
const Signin = React.lazy(()=> import("./components/Signin"));
const UserAccounts = React.lazy(()=> import("./components/UserAccounts"));
const Create = React.lazy(()=> import("./components/Create"));

const ExpensesAdd = React.lazy(()=> import("./components/ExpensesAdd"));
const Insights = React.lazy(()=> import("./components/Insights"));
const ExpensesList = React.lazy(()=> import("./components/ExpensesList"));


export const loginStatusContext  = React.createContext();

function App() {
	const [state, dispatch] = useReducer(LoginStatusReducer, { flg: false, userid: null, name: null, email: null})
	
	return (
	<>
		<loginStatusContext.Provider value={{state, dispatch}}>
			<Router>
				<div className="App">
					<Nav/>
					<Switch>
						<Route exact path="/home" component={Home}/>
						<Route exact path="/" component={Home}/>
						<Route exact path="/signin">
							<React.Suspense fallback={<BlockingOverlay showLoader={true}/>}>
								<Signin/>
							</React.Suspense>
						</Route>
						<Route exact path="/create">
							<React.Suspense fallback={<BlockingOverlay showLoader={true}/>}>
								<Create/>
							</React.Suspense>
						</Route>
						<Route exact path="/logout" component={Logout}/>
						<Route exact path="/wallets">
							<React.Suspense fallback={<BlockingOverlay showLoader={true}/>}>
								<UserAccounts/>
							</React.Suspense>
						</Route>

						<Route exact path="/expenseslist">
							<React.Suspense fallback={<BlockingOverlay showLoader={true}/>}>
								<ExpensesList/>
							</React.Suspense>
						</Route>

						<Route exact path="/expensesadd">
							<React.Suspense fallback={<BlockingOverlay showLoader={true}/>}>
								<ExpensesAdd/>	
							</React.Suspense>	
						</Route>

						<Route exact path="/insights">
							<React.Suspense fallback={<BlockingOverlay showLoader={true}/>}>
								<Insights/>
							</React.Suspense>
						</Route>
						{/* <Route exact path="/edit-profile" component={EditProfile}/> */}
					</Switch>
				</div>
			</Router>
		</loginStatusContext.Provider>
	</>
  	);
}

export default App;
