import React, { useState } from 'react';
import style from '../styles/FilterBar.module.css';
import Datepicker from './separate components/Datepicker';
import '../index.css'
import cross from '../media/cross.png'
import BlockingOverlay from './separate components/BlockingOverlay';
import Checkbox from './separate components/Checkbox';

const warningType = {
	amount: 1
}

function FilterBar(props) {
	const {filter, accounts ,isFilterBarVisible, getFilterData, changeFilterBarStatus} = props

	const [filterAttributes, setfilterAttributes] = useState(filter);
	const [warning, setWarning] = useState({flag: false, type: null, text: ""});


	const checkAmountRange = () => {
		if(!filterAttributes["amount"]["status"])
			return true;
		let amountFrom = document.getElementById("amountFrom").value;
		let amountTo = document.getElementById("amountTo").value;
		console.log(`${typeof amountFrom}==  ${amountTo}`)

		if(!amountFrom || !amountTo || parseFloat(amountFrom)>=parseFloat(amountTo) || parseFloat(amountTo)<=parseFloat(amountFrom))
			return false
		return true;
	}

	const onApply = ()=>{
		if(!checkAmountRange()){
			setWarning({flag: true, type: warningType.amount, text: "Amount range is incorrect"});
			return;
		}

		console.log("Apply");
		getFilterData(filterAttributes);
	}

	const hideFilterBar = () =>{
		changeFilterBarStatus();
	}

	const handleChange = e =>{
		const fieldName = e.target.name;
		const fieldId = e.target.id;
		
		if(fieldName == "amountFrom"){
			setWarning({flag: false, type: null, text: ""});
			setfilterAttributes({...filterAttributes, amount: {...filterAttributes.amount, value: {...filterAttributes.amount.value, from: e.target.value}}})
			return 
		}
		if(fieldName == "amountTo"){
			setWarning({flag: false, type: null, text: ""});
			setfilterAttributes({...filterAttributes, amount: {...filterAttributes.amount, value: {...filterAttributes.amount.value, to: e.target.value}}})
			return 
		}
		
		setfilterAttributes({...filterAttributes, [fieldName]: {...filterAttributes[`${fieldName}`], value: fieldId}})
	}

	const checkBoxChange = e => {
		const fieldName = e.target.name;
		setfilterAttributes({...filterAttributes, [fieldName]: {...filterAttributes[e.target.name], status: e.target.checked}})
	}


	return (
		<>
		<BlockingOverlay showLoader={false}/>
		<div className={style.parent_container}>
			<img title="close" onClick={()=>hideFilterBar()} src={cross} className={style.cross} alt="close"></img>
			<h1 className={style.filterbar_heading}>Filters</h1>

			<div className={style.filtercontainer}>
				<div className={style.filterOptionDiv}>
					<Checkbox name={"date"} bChecked={filterAttributes.date.status} onChangeHandler={checkBoxChange}></Checkbox>
					{/* <input type='checkbox' name="date" checked={filterAttributes.date.status} onChange={checkBoxChange}></input> */}
					<div className={style.datepickerParent}>
						<div className={`${style.datepickerDiv} ${!filterAttributes.date.status && style.disabledOverlay}`}>
							
							<label>From</label>
							<Datepicker 
								formatandhandler={{ 
									state: filterAttributes.date.value.from, 
									format: "dd/MM/yyyy", 
									view: ["year", "month", "date"], 
									handler: (date)=>{setfilterAttributes({...filterAttributes, date: {...filterAttributes.date, value: {...filterAttributes.date.value, from: date}}})},}}
							/>
				
						</div>
						<div className={`${style.datepickerDiv} ${style.marginLeft} ${!filterAttributes.date.status && style.disabledOverlay}`}>
							<label>To</label>
							<Datepicker
								formatandhandler={{ 
									state: filterAttributes.date.value.to, 
									format: "dd/MM/yyyy", view: ["year", "month", "date"], 
									handler: (date)=>{setfilterAttributes({...filterAttributes, date: {...filterAttributes.date, value: {...filterAttributes.date.value, to: date}}})},}}
							/>
					
						</div>
					</div>
				</div>
				<hr></hr>
				<div className={style.filterOptionDiv}>
					<Checkbox name={"expenseType"} bChecked={filterAttributes.expenseType.status} onChangeHandler={checkBoxChange}></Checkbox>

					{/* <input type='checkbox' name="expenseType" checked={filterAttributes.expenseType.status} onChange={checkBoxChange}></input> */}
					<div className={`${style.expenseTypeDiv} ${!filterAttributes.expenseType.status && style.disabledOverlay}`}>
						<label>Expense Type</label>
						<div >
							<button 
								className={`${style.optionBtn} ${filterAttributes.expenseType.value == '1' && style.activeOption}` } 
								name="expenseType"
								id="1"
								onClick={handleChange}>
								income
							</button>
							<button 
								className={`${style.optionBtn} ${filterAttributes.expenseType.value == '0' && style.activeOption}` } 
								name="expenseType"
								onClick={handleChange}
								id="0">
								spent
							</button>
						</div>
					</div>
				</div>
				<hr></hr>
				{
					accounts != null && (
						<>
						<div className={style.filterOptionDiv}>
							<Checkbox name={"account"} bChecked={filterAttributes.account.status} onChangeHandler={checkBoxChange}></Checkbox>
							{/* <input type='checkbox' checked={filterAttributes.account.status} name="account" onChange={checkBoxChange}></input> */}
							<div className={`${style.accountsDiv} ${!filterAttributes.account.status && style.disabledOverlay}`}>
								<label>Accounts</label>
								<div className={style.accountsOptionDiv}>
								{
									accounts.map(account=> {
										return <button 
											className={`${style.optionBtn} ${filterAttributes.account.value == account._id && style.activeOption}` } 
											name="account" id={account._id} 
											onClick={handleChange}>{account.accountName}
											</button>
									})
								}
								</div>
							</div>
						</div>
						<hr></hr>
						</>
					)
				}
				<div className={style.filterOptionDiv}>
					<Checkbox name={"currency"} bChecked={filterAttributes.currency.status} onChangeHandler={checkBoxChange}></Checkbox>
					{/* <input type='checkbox' name="currency" checked={filterAttributes.currency.status} onChange={checkBoxChange}></input> */}
					<div className={`${style.currencyDiv} ${!filterAttributes.currency.status && style.disabledOverlay}`}>
						<label>Currency</label>
						<div>
						<button className={`${style.optionBtn} ${filterAttributes.currency.value == '2' && style.activeOption}`} id="2" name="currency" onClick={handleChange}>$</button>
						<button className={`${style.optionBtn} ${filterAttributes.currency.value == '1' && style.activeOption}`} id="1" name="currency" onClick={handleChange}>₹</button>
						</div>
					</div>
				</div>
				<hr></hr>
				<div className={style.filterOptionDiv}>
					{
						warning.flag && warning.type == warningType.amount && (
							<p className={style.warning}>{warning.text}</p>
						)
					}
					<Checkbox name={"amount"} bChecked={filterAttributes.amount.status} onChangeHandler={checkBoxChange}></Checkbox>
					{/* <input type='checkbox' name="amount" checked={filterAttributes.amount.status} onChange={checkBoxChange}></input> */}
					<div className={`${style.amountDiv} ${!filterAttributes.amount.status && style.disabledOverlay}`}>
						<label>Amount</label>
						<div className={style.amountOptionDiv}>
							<p>From</p>
							<input type="number" name="amountFrom" id="amountFrom" value={filterAttributes.amount.value.from} className={style.amountInput} onChange={handleChange}></input>
							<p>To</p>
							<input type="number" name="amountTo" id="amountTo" value={filterAttributes.amount.value.to} className={style.amountInput} onChange={handleChange}></input>
						</div>
					</div>
				</div>
				
				</div>
				
				<button className={`btnSubmit ${style.Applybtn}`} onClick={()=>onApply()}>Apply</button>
			
		</div>
		</>
	);
}

export default FilterBar;
