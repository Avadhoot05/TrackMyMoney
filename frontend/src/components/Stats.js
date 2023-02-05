import React from "react";
import style from "../styles/ExpenseList.module.css";

const Stats = (props) => {
  const { response, filter, type } = props.props;

  const amount = {
    Food: { "₹": 0, $: 0 },
    Travel: { "₹": 0, $: 0 },
    Accessories: { "₹": 0, $: 0 },
    Investment: { "₹": 0, $: 0 },
    Other: { "₹": 0, $: 0 },
  };

  response.map((obj) => {
    amount[obj.itemtype][obj.currency] += Number(obj.amount);
  });

  var renderData = [];

  for (const [type, currency] of Object.entries(amount)) {
    renderData.push(
      <div
        className={`${style.briefcardcontainer} ${style.briefcardcontainer1}`}
      >
        <h2 className={style.briefcardtitle}>{type}</h2>
        <div className={style.briefcardamtcontainer}>
          <h4 className={style.briefcardamt}>₹ {currency["₹"]}</h4>
          <h4 className={style.briefcardamt}>$ {currency["$"]}</h4>
        </div>
      </div>
    );
  }

  return filter.type ? (
    <>
      <div className={`${style.briefcardcontainer}`}>
        <h2 className={style.briefcardtitle}>{type}</h2>
        <div className={style.briefcardamtcontainer}>
          <h4 className={style.briefcardamt}>₹ {amount[type]["₹"]}</h4>
          <h4 className={style.briefcardamt}>$ {amount[type]["$"]}</h4>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className={style.briefgrid}>{renderData}</div>
    </>
  );
};

export default Stats;
