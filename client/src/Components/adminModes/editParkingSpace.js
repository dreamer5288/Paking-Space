import React,{useState,useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container,Button,Card} from '@material-ui/core';
import TextInput from "@material-ui/core/TextField";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import axios from 'axios'
import currentUserContext from '../../Context/useContext'
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

const EditParkSpace = (props) => {
  const {changeSelectedMode,changeIndicatortab} = props
  const classes = useStyles();
  const {user,setUser,currentParking,setCurrentParking} = useContext(currentUserContext)
  const [err, setErr] = useState({});
  const [rowValue,setRowValue] = useState()
  const [colValue,setColValue] = useState()
  const [open, setOpen] = useState(false)
  const [serverError, setServerError] = useState(false)

  const changeRowValue = (e) => {
    const {value} = e.target;
    setRowValue(value)
  }

  const changeColValue = (e) => {
   const {value} = e.target;
   setColValue(value);
  }

  const handleError =  (newerr) => {
    setErr(newerr)
  }

  const setNewUser = (newUser) => {
    setUser(newUser);
  }

  const handleClick = async (e) => {
      setErr({})
      setOpen(true);
      console.log(rowValue,colValue)
      try {
        const url = `http://localhost:5000/config`
        const response = await axios.post(url, {
          userID: user._id,
          row : rowValue,
          column : colValue,
        })
        console.log(response)
        const updatedUser=response.data.user;
        console.log('Updated user',updatedUser)
        if(updatedUser) {
          setNewUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(user));
          setCurrentParking({})
          setOpen(false)
          alert('Parking Space updated!')
          changeSelectedMode('Dashboard')
          changeIndicatortab(0);
        } else {
          setOpen(false)
          setServerError(true)
          handleError(response.data);
        }

      } catch (error) {
        setOpen(false)
        console.log(error)
      }


  }

  return (
    serverError ?
      <ErrorPanel/>
    : 
      <Container className={classes.container}>
          <div className = {classes.header}>
              <div className = {classes.name}>
                  EDIT PARKING SPACE
              </div>
          </div>
          <Card className={classes.card}>
          <div className={classes.inputContainer}>
            <InputLabel>Rows</InputLabel>
            <Select labelId="demo-simple-select-helper-label" value={rowValue} onChange={changeRowValue} variant="outlined" helperText={err.code === 0 ? err.error : ""}>
            <MenuItem value={'1'}>1</MenuItem>
            <MenuItem value={'2'}>2</MenuItem>
            <MenuItem value={'3'}>3</MenuItem>  
            <MenuItem value={'4'}>4</MenuItem>  
            </Select>  
          </div> 
          <div className={classes.inputContainer}>
          <InputLabel>Columns</InputLabel>
            <Select labelId="demo-simple-select-helper-label" value={colValue} onChange={changeColValue} variant="outlined" helperText={err.code === 0 ? err.error : ""}>
            <MenuItem value={'1'}>1</MenuItem>
            <MenuItem value={'2'}>2</MenuItem>
            <MenuItem value={'3'}>3</MenuItem>  
            <MenuItem value={'4'}>4</MenuItem>  
            </Select>     
          </div>
          <Button className={classes.submitButton} variant="contained" color="primary" onClick = {handleClick}>Confirm Update</Button>   
          </Card>
          <Backdrop className={classes.backdrop} open={open}>
            <CircularProgress color="primary" />
          </Backdrop>
      </Container>
  );
}

export default EditParkSpace

