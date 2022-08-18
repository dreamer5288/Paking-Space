import react from "react";
import {Link} from "react-router-dom";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import img from "../images/IIITA_CC3_FRONT_RIGHT.jfif";
import carimg from "../images/CarShare.jpg";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    Container : {
        height : "80vh",
        minWidth  : "100%",
        backgroundColor: "#fff",
        backgroundImage : `url(${img})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        display : "flex",
        justifyContent : "center",
        alignItems : "center",
        paddingLeft : "25%",
        paddingRight : "10%",
        flexWrap : "wrap",
        [theme.breakpoints.down("sm")] : {
            paddingLeft : "20%",
            paddingRight : "20%"
        }
    },
    root: {
        maxWidth: 345,
        transition: "all .1s ease-in-out",
        "&:hover" : {
            boxShadow: "inset -.1rem -.15rem 0 .1rem rgba(0,0,0,.2)",
            transform: "translateY(-.1rem) scale(1.02)"
        },
        [theme.breakpoints.down("sm")] : {
            width : "100%",
            margin : 10
        }
    },
    header : {
        fontWeight : "300",
        fontSize : 25,
        fontFamily : "emoji",
        [theme.breakpoints.down("sm")] : {
            fontSize : 15
        }
    },
    media: {
        height: 140,
        [theme.breakpoints.down("sm")] : {
            height : 140
        }
    }, 
    body : {
        fontSize : 18,
        [theme.breakpoints.down("sm")] : {
            fontSize : 12
        }
    },
    btnContainer : {
        width : "30%",
        display : "flex",
        flexDirection : "column",
        justifyContent : "space-between",
        alignItems : "left",
        [theme.breakpoints.down("sm")] : {
            width : "100%"
        }
    },
    Button : {
        marginBottom : 20,
        borderRadius : "5px",
        transition: "all .1s ease-in-out",
        backgroundColor : "#2B65EC",
        minWidth : "150px",
        "&:hover" : {
            backgroundColor : "#306EFF",
            boxShadow: "inset -.1rem -.15rem 0 .1rem rgba(0,0,0,.2)",
            transform: "translateY(-.1rem) scale(1.02)"
        }, 
        [theme.breakpoints.down("sm")] : {
            width : "100%",
            alignItems : "center",
            borderRadius : "2px",
            miWidth : "100px"
        }
    }, 
    toLink : {
        textDecoration : "None", 
        fontSize : "15px",
        color : "#fff",
        fontWeight : "800",
        fontFamily : "emoji",
        width : "100%",
        height : "100%",
        textAlign : "center",
        [theme.breakpoints.down("md")] : {
            fontSize : "10px"
        }
    }
}))

const HomePage = () => {
    const classes = useStyles();
    return (
        <Container className = {classes.Container}>
            <Card className={classes.root}>
                <CardActionArea>
                    <CardMedia
                    className={classes.media}
                    image = {carimg}
                    title="Contemplative Reptile"
                    />
                    <CardContent>
                    <Typography className = {classes.header}>
                        ParkInSpace
                    </Typography>
                    <Typography className = {classes.body}>
                        “ParkInSpace” is a web application that provides automated parking assistance in 
                        the parking space near CC3 building, IIIT ALLAHABAD. 
                    </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Container className = {classes.btnContainer}>
                    <Button variant="contained" className = {classes.Button}>
                        <Link to = "/register" className = {classes.toLink}> Register </Link>
                    </Button>

                    <Button variant="contained" className = {classes.Button}>
                        <Link to = "/login" className = {classes.toLink}> Login </Link>
                    </Button>

            </Container>
        </Container>
    )
}

export default HomePage;