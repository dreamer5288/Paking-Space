import react from 'react'
import { makeStyles } from '@material-ui/core/styles';

import img from "../images/serverError.jpg"

const useStyles = makeStyles((theme) => ({
  panel : {
    minHeight : "100%",
    minWidth : "100%",
    display:  "flex",
    flexDirection : "column",
    alignItems : "center",
    justifyContent : "center"
  }, 
  image : {
      padding : "25px",
      maxHeight : "80%",
      maxWidth : "80%"
  }  
}))

const ErrorPanel = () => {

    const classes = useStyles()

    return (
        <div className = {classes.panel}>
        <img src={img} alt = "server error" className = {classes.image}/>
        </div>
    );
}

export default ErrorPanel