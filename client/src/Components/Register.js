import React , {useState, useContext} from "react";
import {Link} from "react-router-dom";
import { Card, Container } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles"
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import TextInput from "@material-ui/core/TextField";
import {useHistory} from "react-router-dom";

import axios from "axios";

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import currentUserContext from '../Context/useContext'
import ErrorPanel from './errorPanel.js'

const useStyles = makeStyles((theme) => ({
    container : {
        display : "flex",
        alignItems : "center",
        justifyContent : "center",
        minHeight : "100vh"
    },
    card : {
       width : 600, 
       padding : "30px",
       display : "flex",
       alignItems : "center",
       flexDirection : "column"
    },
    header : {
       fontWeight : "bold",
       color : "#0846B0",
       fontSize : "25px",
       textAlign : "center",
       fontFamily : "emoji"
    },
    tabContainer : {
       margin : "20px 0px"  
    },
    inputContainer : {
        marginTop : "20px",
        width : "100%",
        "& > div" : {
            width : "100%"   
        }
    },
    submitButton  : {
        margin : 30
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    }
}))

const TabPanel = ({index , value}) => {
    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
       {/* {value === index ? `index ${index}` : ""} */}
      </div>
    )
}

const Register = () => {
  const [value, setValue] = useState(0)
  const [err, seterr] = useState({});
  const [serverError, setServerError] = useState(false)
  const [nameValue, setNameValue] = useState("")
  const [emailValue , setEmailValue] = useState("")
  const [phoneNumber , setPhoneNumber] = useState("")
  const [passwordValue , setPasswordValue] = useState("")
  const [userNameValue , setUserNameValue] = useState("")
  const history = useHistory();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  const {open, setOpen} = useContext(currentUserContext)

  function a11yProps(index) {
      return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
      };
  }

  const changeNameValue = (e) => {
    const {value} = e.target;
    setNameValue(value)
  }

  const changeEmailValue = (e) => {
   const {value} = e.target;
   setEmailValue(value);
  }

  const changePasswordValue = (e) => {
    const {value} = e.target;
    setPasswordValue(value);
  }

  const changeUserNameValue = (e) => {
    const {value} = e.target;
    setUserNameValue(value);
  }

  const changePhoneNumber = (e) => {
    const {value} = e.target;
    setPhoneNumber(value);
  }

  const handleError =  (newerr) => {
     seterr(newerr)
  }

  const handleClick = async () => {
    handleError({})
    setOpen(true)
    const url = "http://localhost:5000/register"
    const userCategory = value === 0 ? 'Admin' : 'Driver'
    try {
          const response = await axios.post(url, {
            name : nameValue,
            username : userNameValue,
            email : emailValue,
            phone : phoneNumber,
            password : passwordValue,
            category : userCategory
          })
          const {data} = response;
          if(data === "success") {
              setOpen(false)
              alert('Registration Sucessfull!')
              history.push('/login');
          } else {
            setOpen(false)
            handleError(data);
          }
          console.log(response);
    } catch (error) {
      setOpen(false)
      setServerError(true)
      console.log(error);
    }

  }

  const classes = useStyles()  
  return (
    serverError ?
      <ErrorPanel/>
    :
      <Container className={classes.container}>
      <Card className={classes.card}>
         <div className={classes.header}>Join ParkInSpace as a</div>
         <Tabs className={classes.tabContainer} value={value} onChange={handleChange} aria-label="simple tabs example" centered>
          <Tab label="Admin" {...a11yProps(0)} />
          <Tab label="Driver" {...a11yProps(1)} />
        </Tabs>
        
        <div className={classes.inputContainer}>
          <TextInput required id="standard-required" value={nameValue} onChange={changeNameValue} variant="outlined" label="Name" helperText={err.code === 0 ? err.error : ""}/>    
        </div> 
        <div className={classes.inputContainer}>
          <TextInput required id="standard-required" value={userNameValue} onChange={changeUserNameValue} variant="outlined" label="User Name" helperText={err.code === 1 ? err.error : ""}/>    
        </div> 
        <div className={classes.inputContainer}>
          <TextInput required id="standard-required" value={emailValue} onChange={changeEmailValue} variant="outlined" label="Email" helperText={err.code === 2 ? err.error : ""}/>    
        </div>
        <div className={classes.inputContainer}>
          <TextInput required id="standard-required" value={phoneNumber} onChange={changePhoneNumber} variant="outlined" label="Contact Number" helperText={err.code === 3 ? err.error : ""}/>    
        </div> 
        <div className={classes.inputContainer}>
          <TextInput required id="standard-required" value={passwordValue} type="password" onChange={changePasswordValue} variant="outlined" label="Password" helperText={err.code === 4 ? err.error : ""}/>    
        </div> 
        <Button className={classes.submitButton} variant="contained" color="primary" onClick = {handleClick}>Create Your Account</Button>   

        <div style = {{fontSize : "15px"}}>
         have an account? <Link to = "/login" style = {{fontSize : "17px", textDecoration : "None", color : "#0000A0"}}>Login&#8594;</Link>
        </div>
      </Card>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      </Container>
  )
}



export default Register