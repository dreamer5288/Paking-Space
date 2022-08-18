import "date-fns";
import React,{useState,useContext} from "react";
import currentUserContext from "../../Context/useContext"

import axios from "axios"

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog';
import TextInput from "@material-ui/core/TextField"
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import { makeStyles, responsiveFontSizes } from '@material-ui/core/styles'; 

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorPanel from '../errorPanel.js'

const useStyles = makeStyles((theme) => ({
  root : {
    display : "flex",
    flexDirection: "column",
    alignItems : "center",
    justifycontent : "flex-start",
    paddingTop : "40px",
    [theme.breakpoints.down("sm")] : {
      width: "100%",
      paddingTop : "20px",
    }
  },
  head : {
    display : "flex",
    flexDirection : "column",
    margin: theme.spacing(1),
    marginBottom : theme.spacing(5),
    justifyContent : "start",
    alignItems : "center",
    [theme.breakpoints.down("sm")] : {
      width: "100%"
    }
  },
  name : {
    fontFamily: "emoji",
    fontWeight : "300",
    fontSize : 27,
    [theme.breakpoints.down("sm")] : {
      fontSize : 15
    }
  },
  submitButton  : {
    margin : 30,
  },
  bookingPanel: {
    width : "100%",
    display : "flex",
    flexDirection : "column",
    alignItems : "center",
    [theme.breakpoints.down("sm")] : {
      margin : 0,
      padding : 0
    }
  },
  inputContainer : {
    marginTop : 20,
    width : "50%",
    "& > *" : {
        width : "100%",
        marginBottom : 40
    },
    [theme.breakpoints.down("sm")] : {
      width : "90%",
      margin : "auto"
    }
  },
  paperAlloted : {
    padding: theme.spacing(1),
    background: "linear-gradient(45deg, #c2e59c 40%, #7CFC00 60%)"
  },
  paperEmpty: {
      padding: theme.spacing(1),
      background : "linear-gradient(45deg, #ff7961 20%, #ba000d 70%)",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
}))


const Booking = (props) => {
  // The first commit of Material-UI
  const classes = useStyles()
  const {user,setUser,currentParking,setCurrentParking} = useContext(currentUserContext)
  const {changeSelectedMode,changeIndicatortab} = props
  const [openLoader, setOpenLoader] = useState(false)
  const [open, setOpen] = useState(0)
  const [openBackDrop,setOpenBackDrop] = useState(false)
  const [err,setErr] = useState("")
  const [availableParkingSlotId, setAvailableParkingSlotId] = useState("") 
  const [vehicleNumber,setVehicleNumber] = useState("");
  const [searchStatus, setSearchStatus] = useState(false)
  const [dimensions, setDimensions] = useState({})
  const [serverError, setServerError] = useState(false)
  const [selectedTime1, setSelectedTime1] = React.useState(
    new Date()
  );  
  
  const handleTime1Change = (time) => {
    setSelectedTime1(time);
    console.log(selectedTime1);
  };

  const [selectedTime2, setSelectedTime2] = React.useState(
    new Date()
  );

  let slots = []
  
  const handleTime2Change = (time) => {
    if(time < selectedTime1) {
      alert(`Invalid Time. You can only leave after ${selectedTime1}`)
      return
    }
    setSelectedTime2(time);
    console.log(selectedTime2);
  };

  const generateSlots = (dimesions) => {

    for(let i = 1; i <= dimensions.row; i++) {
      for(let j = 1; j <= dimesions.column; j++) {
        if(`space_${i}_${j}` === availableParkingSlotId) {
          slots.push(1)
        } else {
          slots.push(0)
        }
      }
    }
    console.log(slots)
  }

  const handleSlotId = async () => {
    // setAvailableParkingSlotId(slotId)
    setOpenLoader(true);

    try {
      let URL = 'http://localhost:5000/parkingSpace/find'
      let response = await axios.get(URL)
      const {space} = response.data 
      
      if(!space) {
        alert("All Parking Spots have been taken!")
        return;
      }

      URL = 'http://localhost:5000/parkingSpace/getDimensions'
      response = await axios.get(URL)

      setOpenLoader(false)

      setAvailableParkingSlotId(space.spaceid)
      
      setSearchStatus(true)
    
      setDimensions(response.data)

    } catch (error) {
      setOpenLoader(false)
      setServerError(true)
      console.log(error)
    }
  }

  const changeVehicleNumber = (e) => {
    const {value} = e.target
    setVehicleNumber(value)
  }

  const handleBooking = async () => {
    if(vehicleNumber.length === 0) {
      setErr('Vehicle Number field is mandatory.')
      return;
    }

    setOpenBackDrop(true)

    try {
      let URL = 'http://localhost:5000/parkingSpace/confirmParking'
      const response = await axios.put(URL, {
        spaceid : availableParkingSlotId,
        userid : user._id,
        entrydate : selectedTime1,
        exitdate : selectedTime2,
        vehiclenumber : vehicleNumber,
        email: user.email
      }) 
      const updatedUser = response.data.user;

      if(!updatedUser) {
        alert(response.data.error)
        return;
      }

      let parkingResponse
      if(updatedUser.spaceid) {
        URL = "http://localhost:5000/parkingSpace/isActiveParking"
          parkingResponse = await axios.get(URL, {
          params : {
            spaceid : updatedUser.spaceid
          }
        })
      }

      setUser(updatedUser);
      localStorage.setItem('user',JSON.stringify(updatedUser))
      if(parkingResponse) {
        setCurrentParking(parkingResponse.data)
      }

      setOpenBackDrop(false)
      alert('Booking Successful!!')
      changeSelectedMode('Dashboard')
      changeIndicatortab(0)
    } catch (error) {
      setOpenBackDrop(false)
      setServerError(true)
      console.log(error)
    }
  }

  const handleViewDialog = () => {
    setOpen(true)
  }

  const handleCloseDialog = () => {
    setOpen(false)
  }

  if(dimensions !== {}) {
    generateSlots(dimensions)
  }

  return (
    serverError ? 
      <ErrorPanel/>
    :
      <div className = {classes.root}>
        <div className = {classes.head}>
          <div className = {classes.name}>
            BOOK A PARKING SPOT
          </div>
        </div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
          <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date"
              value={new Date()}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              disabled = "true"
            />
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="from hrs:min"
              minDateMessage = {new Date()}
              onChange={handleTime1Change}
              KeyboardButtonProps={{
                "aria-label": "change time"
              }}
              disabled = "true"
            />
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="to hrs:min"
              value={selectedTime2}
              onChange={handleTime2Change}
              KeyboardButtonProps={{
                "aria-label": "change time"
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>

        <Button className={classes.submitButton} variant="contained" color="primary" onClick = {handleSlotId}>Find Available Parking Spots</Button>
        { openLoader ? 
          <CircularProgress/> 
          : <></>  
        }
        {
          searchStatus ? 
            availableParkingSlotId.length ?
            <div className = {classes.bookingPanel}>
              <div className={classes.inputContainer}>
                <TextInput required id="standard-required" value={vehicleNumber} onChange={changeVehicleNumber} variant="outlined" label="Vehicle Number" helperText = {err}/>    
                {/* <Alert style = {{width : "100%"}} severity="info">Assigned Parking Id = "{availableParkingSlotId}", press Confirm Button to Confirm Booking.</Alert>         */}
                {/* <Chip label = {"Assigned Parking Id = '" + availableParkingSlotId + "', press Confirm Button to Confirm Booking"} style = {{fontSize : "14px"}} /> */}
                <div>
                  To view the Alloted slot <Button style={{color : "blue"}} onClick = {handleViewDialog}>Click Here&#8594;</Button>
                </div>
              </div>
              <Dialog onClose={handleCloseDialog} open={open} style = {{margin : "auto", overflow : "hidden"}}>
                  <Grid container spacing={3} style = {{margin : "0", width : "100%"}}>
                    {
                      slots.map((slot) => 
                      <Grid item xs={12/dimensions.column}>
                      <Paper className={(slot === 1) ? classes.paperAlloted : classes.paperEmpty}>
                      </Paper>
                      </Grid>)
                    }
                  </Grid>
                </Dialog>
              <Button className={classes.submitButton} variant="contained" color="primary" onClick = {handleBooking}>Confirm Booking</Button>
              <Backdrop className={classes.backdrop} open={openBackDrop}>
                <CircularProgress color="primary" />
              </Backdrop>   
            </div>
            :
            <></>
          : 
          <></>
        }

      </div>
  );
}

export default Booking