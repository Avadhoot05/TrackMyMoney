import React from "react";

import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";

import { makeStyles } from "@material-ui/core/styles";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";


const useStyles = makeStyles((theme) => ({
    textColor: {
      color: "#000",
      justifyContent: "flex-end"
    },

    backgroundColor: {
        backgroundColor: "rgb(174 226 255 / 16%)",
        padding: "10px 10px",
        borderRadius: "5px",
        border: "none",
    }, 

    zIndex: {
        zIndex: "inherit"
    }
}));
  


function Datepicker(props) {

    const {state,format,view,handler} = props.formatandhandler


    const classes = useStyles();

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                fullWidth
                selected={state}
                InputProps={{ className: [classes.textColor, classes.backgroundColor, classes.zIndex] }}
                value={state}
                variant="inline"
                name="datepicker"
                views={view}
                format={format}
                margin="normal"
                onChange={handler}
            />
        </MuiPickersUtilsProvider>
    )
}

export default Datepicker
