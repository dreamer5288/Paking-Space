import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router , Route , Switch, useHistory } from "react-router-dom";

import currentUserContext from "./Context/useContext"
import Login from "./Components/Login"
import Register from "./Components/Register"
import TopPageDesign from "./Components/TopPagedesign" 
import HomePage from "./Components/HomePage"
import Profile from './Components/Profile'
import React, { useState  , useEffect } from 'react'
import axios from "axios"

import moment from 'moment';
import playAlert from 'alert-sound-notify'

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

let intervalId

function App() {

  const [user, setUser] = useState({})
  const [currentParking, setCurrentParking] = useState({})
  const [timeRemaining, setTimeRemaining] = useState()
  const [open, setOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const history = useHistory()
  let count=0;

  useEffect(() => {
    if(window.location.pathname === "/" || window.location.pathname === "/register" || window.location.pathname === "/login") return;
    console.log("APP.js useEffect is running-----");
    setOpen(true)
    const previousUserJson = localStorage.getItem('user');
    const previousUser = JSON.parse(previousUserJson);
    if(previousUser) {
      const findUserById = async () => {
        let url = "http://localhost:5000/user/findUserById"

        try {
          const response = await axios.get(url , {
            params : {
            id : previousUser._id
            }
          })

          let parkingResponse

          if(previousUser.spaceid) {
              url = "http://localhost:5000/parkingSpace/isActiveParking"
              parkingResponse = await axios.get(url, {
              params : {
                spaceid : previousUser.spaceid
              }
            })
          }
          
          setOpen(false)

          history.push(`${window.location.pathname}`)
          setUser(previousUser);
          if(parkingResponse) {
            setCurrentParking(parkingResponse.data)
          }
        } catch(err) {
          setOpen(false)
          console.log(err)
          history.push('/login')
        }
      }

      findUserById();
    }else {
      setOpen(false);
      history.push('/login')
    }
  }, [])

  useEffect(() => {
    
    clearInterval(intervalId)
    setTimeRemaining("")

    if(currentParking.status === "active") {
        intervalId = setInterval(() => {

          if(count<1 && moment(currentParking.exitdate).diff(new moment()) <= 60000) {
            console.log('alert')
            playAlert('submarine')
            setAlertOpen(true);
            count++;
            console.log("count",count)
          }

          let currentTime = new Date()
          let exitTime = new Date(currentParking.exitdate)
          if(exitTime < currentTime) {
            setCurrentParking({status: "expired", vehiclenumber : currentParking.vehiclenumber})
            return
          }
          let remTime = exitTime - currentTime;
          let hours = Math.floor((remTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          let minutes = Math.floor((remTime % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((remTime % (1000 * 60)) / 1000);

          setTimeRemaining(`${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `0${seconds}`}`)
      }, 200)

      if(currentParking.status === "expired") {
        setTimeRemaining("")
        clearInterval(intervalId)
        count=0
      }
    }
  }, [currentParking])
  
  const handleClose = () => {
    setAlertOpen(false)
    count++;
  }

  return (
    <React.Fragment>

      <currentUserContext.Provider value = {{user,setUser,currentParking,setCurrentParking,timeRemaining, open, setOpen}}>
        <TopPageDesign/>

        <Switch>
          <Route exact path="/" component={HomePage}/>
          <Route exact path="/register" component={Register} />
        </Switch>

        <Switch>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/Profile" component={Profile}/>
        </Switch>
      </currentUserContext.Provider>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Your booking will expire in 1 minute. Please update/terminate your booking."
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
}

export default App;

