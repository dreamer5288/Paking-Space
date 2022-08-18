import react, {useContext,useHistory} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import {blueGrey} from '@material-ui/core/colors';
import ProfileIcon from '@material-ui/icons/AccountCircle';

import currentUserContext from '../../Context/useContext';

const useStyles = makeStyles((theme) => ({
    root : {
        backgroundColor : "#fff",
        minHeight : "75vh",
        margin: 0,
        paddingTop : "40px",
        [theme.breakpoints.down("sm")] : {
            paddingTop : "20px",
            width:  "100%"
        }
    },
    head : {
        display : "flex",
        flexDirection : "column",
        margin: theme.spacing(1),
        justifyContent : "start",
        alignItems : "center"
    },
    icon: {
        width: theme.spacing(14),
        height: theme.spacing(14),
        color: '#fff',
        backgroundColor: blueGrey[500],
        marginBottom : 20,
        fontSize : "120px",
        [theme.breakpoints.down("sm")] : {
            width: theme.spacing(9),
            height: theme.spacing(9)
        }
    }, name : {
        fontFamily: "emoji",
        fontWeight : "300",
        fontSize : 22,
        [theme.breakpoints.down("sm")] : {
            fontSize : 12
        }
    }, driverBody : {
        display : "flex",
        flexWrap : "wrap",
        justifyContent : "center",
        alignItems : "center",
        width : "100%",
        marginTop : 90
    }, card: {
        width : 350,
        padding : 20,
        [theme.breakpoints.down("sm")] : {
            padding : 0,
            width : "80%"
        }
    }, cardHeader : {
        marginBottom: 16,
        fontSize : 20,
        [theme.breakpoints.down("sm")] : {
            fontSize : 12
        }
    },
    pos: {
        marginBottom: 10,
        fontSize : 15,
        [theme.breakpoints.down("sm")] : {
            fontSize : 10
        }
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));

const Dashboard = () => {
    const classes = useStyles()
    const {user,currentParking,timeRemaining} = useContext(currentUserContext);

    return (
        <div className = {classes.root} >
            <div className = {classes.head}>
                <Avatar className = {classes.icon}>
                    <ProfileIcon style = {{fontSize : "120px"}}/>
                </Avatar>
                <div className = {classes.name}>
                    {user.name ? user.name.toUpperCase() : ""}
                </div>
            </div>
            
            
            <div className = {classes.driverBody}> 
                <Card className={classes.card} variant="outlined">
                    <CardContent>
                        <Typography color="textPrimary" className = {classes.cardHeader}>
                            Your Parking
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                            Parking SpaceId : {user.spaceid ? user.spaceid : "N.R"}
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                            Vehicle Number : {currentParking.vehiclenumber ? currentParking.vehiclenumber : "N.R"}
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                            Parking Status : {currentParking.status ? currentParking.status : "N.R"}
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                            Time remaining : {user.spaceid ? (timeRemaining ? timeRemaining : "00:00:00") : "N.R"}
                        </Typography>
                    </CardContent>
                </Card>
            </div> 
        </div>
    )
}

export default Dashboard