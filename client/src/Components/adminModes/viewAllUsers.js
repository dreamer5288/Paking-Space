import React,{useContext, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import axios from 'axios';
import { Typography } from '@material-ui/core';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import ErrorPanel from '../errorPanel.js'

const useStyles = makeStyles((theme) => ({
    body : {
        display : "flex",
        flexDirection: "column",
        alignItems : "center",
        justifyContent : "flex-start",
        paddingTop : "40px",
        [theme.breakpoints.down("sm")] : {
            paddingTop : "20px",
            width: "90%",
            margin : "auto"
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
    container : {
        display : "flex",
        flexWrap : "wrap",
        flexDirection : "column",
        alignItems : "center",
        justifyContent : "center",
        width : "100%",
        marginTop : "20px",
    },
    tabContainer : {
        margin : "20px 0px"  
    },
    table : {
        textAlign : "center",
        border : "1px solid black",
        width : "50%",
        marginTop : 20,
        [theme.breakpoints.down("sm")] : {
            width : "100%",
            fontSize : 10
        }
    }, tableHead : {
        backgroundColor : "black",
        color : "#fff"
    }, tableRow : {
        height : "40px",
        fontSize : 15,
        margin : 3,
        [theme.breakpoints.down("sm")] : {
            fontSize : 8
        }
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));

const ViewAllUsers = () => {
    const classes = useStyles();
    const [users, setUsers] = useState(null)
    const [open, setOpen] = useState(true)
    useEffect (() => {
        setOpen(true)
        const getAllUsers = async () => { 
            try {
            let url = "http://localhost:5000/user/getAll"
            const response = await axios.get(url);
            if(response) {
                setOpen(false)
                setUsers(Object.values(response.data.users))
            }
            console.log(response)
        } catch (error) {
            setOpen(false)
            console.log(error)
        }}

        getAllUsers()
    },[])

    function a11yProps(index) {
        return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
        };
    }

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

    return (
        users ?
        <div className = {classes.body}>
            <div className = {classes.head}>
                <div className = {classes.name}>
                    USERS
                </div>
            </div>
            <div className = {classes.container}>
                <Table className = {classes.table}>
                    <Thead className = {classes.tableHead}>
                        <Tr className = {classes.tableRow}>
                        <Th>Name</Th>
                        <Th>Category</Th>
                        <Th>Current Parking Status</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {users.map((user) => (
                                <Tr className = {classes.tableRow}>
                                <Td>    {user.name}  </Td>
                                <Td>     {user.category}   </Td>
                                <Td>    {user.spaceid ? "Parked" : "N.R"}   </Td>
                                </Tr>
                        ))}
                    </Tbody>

                </Table> 
            </div>
        </div>
        :
            open ? 
            <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
            : 
            <ErrorPanel />
    );
}

export default ViewAllUsers