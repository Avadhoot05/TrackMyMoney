import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import BlockingOverlay from './separate components/BlockingOverlay';
import ExpenseListGrids from './ExpenseListGrids';
import FilterBar from './FilterBar';
import EditDb from './EditDb';

import 'react-datepicker/dist/react-datepicker.css';
import { css } from '@emotion/react';
import style from '../styles/ExpenseList.module.css';
import { VscListFilter } from "react-icons/vsc";
import { TiExport } from "react-icons/ti";

import axios from 'axios';
import { loginStatusContext } from '../App';
import { exportXLSX } from '../utils/exportXLSX';

const fallBackUIType = {
	noData: 1,
	loading: 2
}

const QueryMode = {
	fetchRecords: 1,
	updateRecords: 2 
}

const loaderCSS = css`z-index:4;`

function ExpensesList() {
	
	const hist = useHistory();

	const [response, setRes] = useState([]);

	const [filterAttributes, setFilter] = useState({
		date: {status: false, value: {from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), to: new Date()}},
		expenseType: {status: false, value: null},
		currency: {status: false, value: null},
		account: {status: false, value: null},
		amount: {status: false, value: {from: null, to: null}}
	});
	
	const [editDbData, setEditDbData] = useState(null)
	
	const { state } = useContext(loginStatusContext);
	const [bShowFilterDb, SetShowFilterDb] = useState(false);
	const [bShowEditDb, SetShowEditDb] = useState(false);
	const [blockingOverlay, setBlockingOverlay] = useState(true);
	const [accounts, setAccounts] = useState(null);


	//pagination
	const [page, setPage] = useState(1);
	const loader = useRef(null);

	useEffect(() => {
		if(!state.flg)
			hist.push('/signin');

		filterResponse();
		fetchAccounts();

		const observer = new IntersectionObserver(HandleObserver, {root: null, rootMargin: "20px", threshold: 0});
		if (loader.current) 
			observer.observe(loader.current);

	}, [filterAttributes]);


	const HandleObserver = useCallback((entries) => {
		const target = entries[0];
		if (target.isIntersecting) {
		  setPage(page + 1);
		}
	  }, []);


	const showFilterBar = () => {
		SetShowFilterDb(!bShowFilterDb);
	};

	const getFilterData = filterAttr => {
		showFilterBar();
		setFilter(filterAttr);
		filterResponse();
	}

	const filterResponse = () => {
		setBlockingOverlay(true);
		axios.post('/expenseslist', { mode: QueryMode.fetchRecords, filterAttributes, userid: state.userid })
			.then((res) => {
				setBlockingOverlay(false);
				console.log("fetched records")
				console.log(res)
				setRes(res.data);
			})
			.catch((err) => {
				setBlockingOverlay(false);
				console.log(`list error${err}`);
			});
	};

	const handleDelete = (action, expenseId) => {
		// console.log(`${expenseId} must be ${action}`);
		
		axios.post('/expenseslist', { mode: QueryMode.updateRecords, action, expenseId })
		.then((res) => {
			console.log(res.data);
			filterResponse();
		})
		.catch((err) => {
			console.log(`list error${err}`);
		});		
	};

	const handleEdit = (action, expenseData) => {
		console.log(`${expenseData._id} must be ${action}`);
		SetShowEditDb(true);
		setEditDbData(expenseData);
	};

	const fetchAccounts = () => {
		console.log("Fetch");

		axios.post('/fetchaccounts', {userId: state.userid})
		.then(res => {
			console.log(res.data)
			setAccounts(res.data)
		})
		.catch(err => {
			console.log("Fetch accounts error");
			console.log(err);
			setBlockingOverlay(false);
		})
	}

	const HideEditDb = (bReloadRecords) => {
		SetShowEditDb(false);
		
		if(bReloadRecords === true)
		{
			filterResponse();
		}
			
	}

	const onExport = () => {
		exportXLSX(response, filterAttributes["date"]["value"]["from"], filterAttributes["date"]["value"]["to"]);
	}
	
	return (
		<>
		{ editDbData != null && bShowEditDb && <EditDb data={JSON.parse(JSON.stringify(editDbData))} HideEditDb={HideEditDb}></EditDb> }
		{ blockingOverlay && <BlockingOverlay showLoader={true}/>}
		
		<div className={style.container}>			
			<div className={style.headingContainer}>
				<h1 className={style.heading}>transaction history</h1>
				<div>
					<button title="Export As XLSX(Excel)" className={`${style.filterBtn} ${!response.length && style.disabled}`} onClick={onExport}>
						<TiExport className={style.marginRight}/>
						Export
					</button>
					<button title="Filter transactions" className={style.filterBtn} onClick={() => showFilterBar()}>
						<VscListFilter className={style.marginRight}/>
						filter
					</button>
					{
						bShowFilterDb && <FilterBar  filter={filterAttributes} accounts={accounts} isFilterBarVisible={bShowFilterDb} getFilterData={getFilterData} changeFilterBarStatus={showFilterBar}/>
					}
				</div>
				
			</div>
			<hr className={style.horizontalLine}></hr>
			{
				!blockingOverlay &&
				(
					<>
					{
						response.length != 0 ? <ExpenseListGrids response={response} handleEdit={handleEdit} handleDelete={handleDelete} /> : <Fallback type={fallBackUIType.noData}></Fallback>
					}
					</>	
				)
			}

			<div ref={loader} />
			
		</div>
		</>
		)
}

function Fallback(props) {
	return (
		<>
		{
			(props.type == fallBackUIType.noData) 
			&&
			(
				<div className={style.NoDataDiv}>
					<h2 className={style.NoDataTxt}>No Data Found</h2>
				</div>
			)
		}
		</>
		
	)
}

export default ExpensesList;