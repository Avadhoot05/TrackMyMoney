import axios from 'axios';
import React, { useEffect, useContext } from 'react';
import moment from 'moment';

import style from '../styles/Insights.module.css';

import { loginStatusContext } from "../App";
import { useState } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function GetLabels()
{
	let from = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
	let to = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

	let labels = [];
	
	for(let i = 2; from <= to; i++)
	{
		labels.push(from);
		from = new Date(new Date().getFullYear(), new Date().getMonth(), i);
	}

	return labels;
}



function Insights() {
	const { state } = useContext(loginStatusContext);
	const [labels, setLabels] = useState([]);
	const [amountIncome, setAmountIncome] = useState({});
	const [amountSpent, setAmountSpent] = useState({});
	const [amountInvest, setAmountInvest] = useState({});

	useEffect(function()
	{
		console.log("loaded")
		if(state.flg)
		{
			FetchData(state.userid);
		}
	}, []);

const ProcessResponseToPlot = (data) =>
{
	let xlabels = GetLabels();
	let amountINR = [];
	let amountUSD = [];
	let incomeAmountINR = [];
	let incomeAmountUSD = [];
	let investAmountINR = [];
	let investAmountUSD = [];

	console.log(xlabels);


	let obj = {};
	let objIncome = {};
	let objInvest = {};


	for(let d of data)
	{
		let key = new Date(d.date).getDate();

		if(key in obj)
		{
			if(d.expenseType == "0")
			{
				if(d.currency == "1")
					obj[key]["INR"] += d.amount;
				else
					obj[key]["USD"] += d.amount;
			}
			//spent
			else if(d.expenseType == "1")
			{
				if(d.currency == "1")
					objIncome[key]["INR"] += d.amount;
				else
					objIncome[key]["USD"] += d.amount;
			}
			else if(d.expenseType == "2")
			{
				if(d.currency == "1")
					objInvest[key]["INR"] += d.amount;
				else
					objInvest[key]["USD"] += d.amount;
			}
		}
		else
		{
			obj[key] = {"INR" : 0, "USD": 0};
			objIncome[key] = {"INR" : 0, "USD": 0};
			objInvest[key] = {"INR" : 0, "USD": 0};

			if(d.expenseType == "0")
			{
				if(d.currency == "1")
				{
					obj[key]["INR"] = d.amount;
				}
				else
				{
					obj[key]["USD"] = d.amount;
				}
			}
			else if(d.expenseType == "1")
			{
				if(d.currency == "1")
				{
					objIncome[key]["INR"] = d.amount;
				}
				else
				{
					objIncome[key]["USD"] = d.amount;
				}
			}
			else if(d.expenseType == "2")
			{
				if(d.currency == "1")
				{
					objInvest[key]["INR"] = d.amount;
				}
				else
				{
					objInvest[key]["USD"] = d.amount;
				}
			}
		}
	}

	// console.log(obj);

	let l = 0;

	while(l < xlabels.length)
	{
		let key = new Date(xlabels[l]).getDate();
		if(key in obj)
		{
			console.log(key);
			amountINR.push(obj[key]["INR"]);
			amountUSD.push(obj[key]["USD"]);
			incomeAmountINR.push(objIncome[key]["INR"]);
			incomeAmountUSD.push(objIncome[key]["USD"]);
			investAmountINR.push(objInvest[key]["INR"]);
			investAmountUSD.push(objInvest[key]["USD"]);
		}
		else
		{
			amountINR.push(0);
			amountUSD.push(0);
			incomeAmountINR.push(0);
			incomeAmountUSD.push(0);
			investAmountINR.push(0);
			investAmountUSD.push(0);
		}

		xlabels[l] = moment(xlabels[l]).format("DD MMM, YYYY");
		l++;
	}
	
	return {xlabels, amountINR, amountUSD, incomeAmountINR, incomeAmountUSD, investAmountINR, investAmountUSD};
}

	const FetchData = userId => {

		axios.post('/insights', {userId})
			.then(res => {
				const {xlabels, amountINR, amountUSD, incomeAmountINR, incomeAmountUSD, investAmountINR, investAmountUSD} = ProcessResponseToPlot(res.data);
				setLabels(xlabels);
				setAmountSpent({arrINR : amountINR, arrUSD: amountUSD});
				setAmountIncome({arrINR : incomeAmountINR, arrUSD: incomeAmountUSD});
				setAmountInvest({arrINR : investAmountINR, arrUSD: investAmountUSD});
			})
			.catch(error => {
				console.log(error);
			})
	}

	const options = {
		responsive: true,
		plugins: {
		  legend: {
			position: 'top',
		  }
		},
	};

	const optionsIncome = {...options, plugins: {...options.plugins, title: {display : true, text: "Income"}}};
	const optionsSpent = {...options, plugins: {...options.plugins, title: {display : true, text: "Spent"}}};
	const optionsInvest = {...options, plugins: {...options.plugins, title: {display : true, text: "Investments"}}};

	const dataSpent = {
		labels,
		datasets: [
		  {
			label: 'USD',
			data: amountSpent.arrUSD,
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgb(255, 99, 132)',
			tension: 0.2
		  },
		  {
			label: 'INR',
			data: amountSpent.arrINR,
			borderColor: '#326B84',
			backgroundColor: '#326B84',
			tension: 0.2
		  },
		],
	  };

	  const dataIncome = {
		labels,
		datasets: [
		  {
			label: 'USD',
			data: amountIncome.arrUSD,
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgb(255, 99, 132)',
			tension: 0.2
		  },
		  {
			label: 'INR',
			data: amountIncome.arrINR,
			borderColor: '#326B84',
			backgroundColor: '#326B84',
			tension: 0.2
		  },
		],
	  };
	
	  const dataInvest = {
		labels,
		datasets: [
		  {
			label: 'USD',
			data: amountInvest.arrUSD,
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgb(255, 99, 132)',
			tension: 0.2
		  },
		  {
			label: 'INR',
			data: amountInvest.arrINR,
			borderColor: '#326B84',
			backgroundColor: '#326B84',
			tension: 0.2
		  },
		],
	  };
  
	return (
		<>
			<div className={style.chartContainer}>
				<Line className={style.chart} options={optionsIncome} data={dataIncome} />
				<Line className={style.chart} options={optionsSpent} data={dataSpent} />
				<Line className={style.chart} options={optionsInvest} data={dataInvest} />

			</div>
			{/* <div className={style.container}>	
				<div className={style.card}>
					<h2 className={style.cardHeading}>Earned</h2>
					<p>R 1000</p>
					<p>$ 2000</p>
				</div>
				<div className={style.card}>
					<h2  className={style.cardHeading}>Spent</h2>
					<p>R 1000</p>
					<p>$ 1000</p>

				</div>
			</div> */}
		</>
	)
}

export default Insights;