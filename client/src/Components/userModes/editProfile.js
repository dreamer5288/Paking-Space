import React,{useState,useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container,Button,Card} from '@material-ui/core';
import TextInput from "@material-ui/core/TextField";

import axios from 'axios'
import currentUserContext from '../../Context/useContext'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import ErrorPanel from '../errorPanel.js'

const useStyles = makeStyles((theme) => ({
    container : {
        display : "flex",
        flexDirection : "column",
        alignItems : "center",
        justifyContent : "flex-start",
        paddingTop : "40px",
        [theme.breakpoints.down("xs")] : {
          width : "90%",
          paddingTop :" 20px"
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
    card : {
        margin : 10,
        width : 600, 
        padding : "30px",
        display : "flex",
        alignItems : "center",
        flexDirection : "column",
        [theme.breakpoints.down("sm")] : {
          margin : 20,
          width : "100%"
        }
    },
    inputContainer : {
        marginTop : "20px",
        width : "100%",
        "& > div" : {
            width : "100%"   
        },
        [theme.breakpoints.down("sm")] : {
          marginTop : "10px"
        }
    },
    submitButton  : {
        marginTop : 30
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    }
}));

const EditProfile = (props) => {
  const {changeSelectedMode,changeIndicatortab} = props
  const classes = useStyles();
  const {user,setUser} = useContext(currentUserContext)
  const [err, setErr] = useState({});
  const [nameValue,setNameValue] = useState(user.name)
  const [emailValue , setEmailValue] = useState(user.email)
  const [phoneNumber , setPhoneNumber] = useState(user.phone)
  const [passwordValue , setPasswordValue] = useState(user.password)
  const [userNameValue , setUserNameValue] = useState(user.username)
  const [open,setOpen] = useState(false)
  const [serverError, setServerError] = useState(false)

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
    setErr(newerr)
  }

  const handleClick = async (e) => {
      setErr({})
      setOpen(true)
      try {
        const url = `http://localhost:5000/user/updateUserProfile`
        const response = await axios.put(url, {
          _id : user._id,
          name : nameValue,
          email : emailValue,
          username : userNameValue,
          phone : phoneNumber,
          password : passwordValue
        })
        const updatedUser= response.data.user;
        if(updatedUser) {
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setOpen(false)
          alert('Your profile has been updated!')
          changeSelectedMode('Dashboard')
          changeIndicatortab(0);
        } 
        else {
          setOpen(false)
          handleError(response.data);
        }
        // console.log(response)

      } catch (error) {
        setOpen(false)
        setServerError(true)
        console.log(error)
      }


  }

  return (
    serverError ?
      <ErrorPanel />
    : 
      <Container className={classes.container}>
          <div className = {classes.header}>
              <div className = {classes.name}>
                  EDIT PROFILE
              </div>
          </div>
          <Card className={classes.card}>
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
          <Button className={classes.submitButton} variant="contained" color="primary" onClick = {handleClick}>Confirm Update</Button>   
          </Card>
          <Backdrop className={classes.backdrop} open={open}>
            <CircularProgress color="primary" />
          </Backdrop>
      </Container>
  );
}

export default EditProfile


// helperText={err.code === 0 ? err.error : ""}
// helperText={err.code === 1 ? err.error : ""}
// helperText={err.code === 2 ? err.error : ""}
// helperText={err.code === 3 ? err.error : ""}
// helperText={err.code === 4 ? err.error : ""}