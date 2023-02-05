import React from 'react';


import style from '../styles/ExpenseCard.module.css';
import moment from 'moment';
import deleteIcon from '../media/trash.png'
import editIcon from '../media/edit.png'
import downloadIcon from '../media/download.png'
import { strings } from '../Strings';

import { currencyMap } from '../constant';

import { download } from '../utils/downloadImage.js';
    
const actionType = {
	edit: 1,
	delete: 2
}

const eExpenseType = {
	income: 1,
	spent: 0, 
	invest: 2
}

export default function ExpenseListGrids({ response, handleEdit, handleDelete }) {	
	console.log(response);

	const downloadAttachedImage = (name)=>{
		download(`https://res.cloudinary.com/avadhootcloud/image/upload/v1645954451/expensetracker/${name}`, name);
	}

	const renderData = response.map((obj, index) => {
		const date = moment(obj.date).format("DD MMM, YYYY");
		
		return (
			<>
			<div key = {obj._id} className={style.row}>
				<div className={style.cell}>
					<p className={style.date}>{date}</p>
				</div>
				<div className={style.cell}>
					<p  className={style.itemName}>{obj.itemname}</p>
				</div>
				<div className={style.cell}>
					<p className={`${style.amount} ${obj.expenseType == eExpenseType.income ? style.income : (obj.expenseType == eExpenseType.spent ? style.spent : style.invest)}`}>{currencyMap[obj.currency]}{obj.amount}</p>
				</div>
				<div className={style.cell}>
					<p className={style.accountName}>{obj.accountName}</p>
				</div>
				<div className={style.iconOverlayDiv}>
			 		<img className={style.icons} title={strings.TOOLTIP_DELETE_TRANSACTION} src={deleteIcon} onClick={()=>handleDelete(actionType.delete, obj._id)}></img>
			 		<img className={style.icons} title={strings.TOOLTIP_EDIT_TRANSACTION} src={editIcon} onClick={()=>handleEdit(actionType.edit, obj)}></img>
					
			 		<img className={`${style.icons} ${!(obj.expenseImagePath).length && style.disableIcon}`} title={strings.TOOLTIP_DOWNLOAD_IMAGE} src={downloadIcon} onClick={()=>downloadAttachedImage(obj.expenseImagePath)}></img>
			 	</div>
			</div>
			</>
			// <>
			// <div key={index} className={style.card}>
			// 	<div className={style.dateContainer}>
			// 		<p className={style.date}>{date}</p>
			// 		<p className={`${style.amount} ${obj.expenseType == eExpenseType.income ? style.income : (obj.expenseType == eExpenseType.spent ? style.spent : style.invest)}`}>{currencyMap[obj.currency]}{obj.amount}</p>
			// 	</div>
				
			// 	<div className={style.infoContainer}>
			// 		<p  className={style.itemName}>{obj.itemname}</p>
			// 	</div>

			// 	<div className={style.infoContainer}>
			// 		<p className={style.accountName}>{obj.accountName}</p>
			// 	</div>

			// 	<div className={style.iconOverlayDiv}>
			// 		<img className={style.icons} title={strings.TOOLTIP_DELETE_TRANSACTION} src={deleteIcon} onClick={()=>handleDelete(actionType.delete, obj._id)}></img>
			// 		<img className={style.icons} title={strings.TOOLTIP_EDIT_TRANSACTION} src={editIcon} onClick={()=>handleEdit(actionType.edit, obj)}></img>
					
			// 		<img className={`${style.icons} ${!(obj.expenseImagePath).length && style.disableIcon}`} title={strings.TOOLTIP_DOWNLOAD_IMAGE} src={downloadIcon} onClick={()=>downloadAttachedImage(obj.expenseImagePath)}></img>
			// 	</div>
			// </div>
			// </>
		);
	});

	return (
		<>
			<div className={style.container}>
				<Header/>
				<div className={style.expenseCardBox}>
					
					{renderData}
				</div>
			</div>
		</>
	);
}

function Header()
{
	return (
		<div className={style.header}>
			<p>Date</p>
			<p>Name</p>
			<p>Amount</p>
			<p>Account</p>
		</div>
	);
}

