import react,{useContext} from "react";
import {Link,useHistory} from "react-router-dom";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import DriveEtaRoundedIcon from '@material-ui/icons/DriveEtaRounded';
import currentUserContext from '../Context/useContext.js'
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
    container : {
        minHeight : "10vh",
        minWidth : "100%",
        backgroundColor : "#1976d2",
        display : "flex",
        justifyContent : "space-between",
        alignItems : "Center",
        [theme.breakpoints.down("sm")] : {
            minHeight : "7vh"
        }
    }, 
    parkingIcon : {
        fontSize : "45px",
        paddingLeft : "1.4rem",
        paddingRight : "0.9rem",
        color : "#353935",
        [theme.breakpoints.down("sm")] : {
            fontSize : "30px",
            paddingLeft : "0.9rem",
            paddingRight : "0.7rem",
        }
    }, 
    heading : {
        fontSize : "35px",
        color : "#fff",
        fontWeight : "400",
        fontFamily : "ui-monospace",
        [theme.breakpoints.down("sm")] : {
            fontSize : "25px",
            fontWeight : 300
        }
    },
    Button : {
        marginRight : "15px",
        minWidth : "70px",
        textAlign : "center",
        maxHeight : "29px",
        fontSize : "12px",
        [theme.breakpoints.down("sm")] : {
            fontSize : "9px",
            marginRight : "7px",
            minWidth : "50px",
            maxHeight : "27px"
        },
        [theme.breakpoints.down("xs")] : {
            display : "none"
        }
    }
}))


const TopPageDesign = () => {
    const classes = useStyles()
    const history = useHistory()
    const {user,setUser,setCurrentParking} = useContext(currentUserContext);
    const {pathname} = window.location
    return (
        <Container className = {classes.container}>
            <Link to="/" style={{textDecoration : "none"}}>
            <div style ={{display : "flex"}}>
                <DriveEtaRoundedIcon className = {classes.parkingIcon}/>
                <div className = {classes.heading}>
                ParkInSpace
                </div>
            </div>
            </Link>
            {
                    (user.name && (pathname !== '/' || pathname !== '/login' || pathname !== '/register')) ?
                    <div style = {{display : "flex"}}>
                        <Button variant="contained" color="primary" className = {classes.Button} onClick = {() => {
                            setUser({})
                            localStorage.setItem('user', JSON.stringify({}))
                            setCurrentParking({})
                            history.push('/')
                        }}>
                            Log Out
                        </Button> 
                    </div>
                    :
                    <div style = {{display : "flex"}}>
                        <Button variant="contained" color="primary" className = {classes.Button} onClick = {() => history.push('/register')}>
                            Sign Up
                        </Button>
                        <Button variant="contained" color="primary" className = {classes.Button} onClick = {() => history.push('/login')}>
                            Log In
                        </Button> 
                    </div>
                }
        </Container>
    )
}

export default TopPageDesign;