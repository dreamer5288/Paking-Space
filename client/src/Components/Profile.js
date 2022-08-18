import react, { useContext, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BookIcon from '@material-ui/icons/Book';
import EditIcon from '@material-ui/icons/Edit';
import ViewIcon from '@material-ui/icons/Pageview';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import UpdateIcon from '@material-ui/icons/EditLocation'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import currentUserContext from '../Context/useContext';

import Dashboard from './userModes/dashboard'
import Booking from './userModes/booking'
import EditProfile from './userModes/editProfile'
import UpdateBooking from './userModes/updateBooking'
import ViewParkingSpace from './userModes/ViewParkingSpace'
import EditParkSpace from './adminModes/editParkingSpace'
import ViewAllUsers from './adminModes/viewAllUsers'
import ViewHistory from './adminModes/viewHistory'

import { useHistory } from 'react-router';

const driverModes = ["Dashboard","Book Parking Slot","Update Parking","Edit Profile", "View Parking Space"]
const adminModes = ["Dashboard","Book Parking Slot","Update Parking","Edit Profile", "View Parking Space","View All Users","View History","Edit Parking Space"]

const useStyles = makeStyles((theme) => ({
  body: {
    display: 'flex',
    flexDirection : 'column',
    width : "100%"
  },
  root: {
    flexGrow: 1,
    width: "100%",
    margin: "auto",
    textAlign: "center"
  },
  Indicator: {
      height: 3,
      boxShadow: 'inset 0 0 6px rgba(0,0,255,.5)',
      transform: "scale(.8)"
  },
  Tab : {
    minWidth: "20%", 
    fontWeight: "400", 
    fontSize: 16,
    [theme.breakpoints.down("sm")] : {
        width: "50%",
        fontSize: 14
    },
    [theme.breakpoints.down("xs")] : {
        width: "50%",
        fontSize: 12
    }
  },
  content: {
    flexGrow: 1,
    [theme.breakpoints.down("sm")] : {
      width : "100%",
    }
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
}));

const Profile = () => {
  
  const [selectedMode, setSelectedMode] = useState("Dashboard");
  
  const {user,setUser,setCurrentParking,open,setOpen} = useContext(currentUserContext)
  const history = useHistory()
  const classes = useStyles()
  const [value,setValue] = useState(0)

  const handleChange = (event,newValue) => {
    const modes = user.category === "driver" ? driverModes : adminModes
    if(selectedMode !== modes[newValue]) {
      if(modes[newValue] === "Book Parking Slot") {
        if(user.spaceid) {
          alert('You already have booked a spot!')
          return
        }
      }

      if(modes[newValue] === "Update Parking") {
        if(!user.spaceid) {
          alert("You haven't booked a parking slot yet")
          return;
        }
      }

      setSelectedMode(modes[newValue]);
      setValue(newValue)
    }
  }


  return (
      open ? 
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      :
      <div className={classes.body}>
    
      <div className = {classes.root}>
      <AppBar position="static" color="default">
        <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="on"
            indicatorColor="none"
            textColor="primary"
            classes={{ indicator: classes.Indicator}}
            aria-label="scrollable article navigation bar"
        >
            {/* {pages.map((page,idx) => 
            <Tab 
            className={classes.Tab} 
            label={<span>{page}</span>} 
            icon={<DashboardIcon />}
            key={idx}
            />)} */}
            <Tab 
            className={classes.Tab} 
            label={<span>Dashboard</span>} 
            icon={<DashboardIcon />}
            key={"Dashboard"}
            />
            <Tab 
            className={classes.Tab} 
            label={<span>Book Parking Slot</span>} 
            icon={<BookIcon />}
            key={"Book Parking Slot"}
            />
            <Tab 
            className={classes.Tab} 
            label={<span>Update Booking Parking</span>} 
            icon={<UpdateIcon />}
            key={"Update Parking"}
            />
            <Tab 
            className={classes.Tab} 
            label={<span>Edit Profile</span>} 
            icon={<EditIcon />}
            key={"Edit Profile"}
            />
            <Tab 
            className={classes.Tab} 
            label={<span>View Parking Space</span>} 
            icon={<ViewIcon />}
            key={"View Parking Space"}
            />
            {user.category === "Admin" ? 
            <Tab 
            className={classes.Tab} 
            label={<span>View All Users</span>} 
            icon={<ViewIcon />}
            key={"View All Users"}
            />: 
            <></>
            }
            {user.category === "Admin" ? 
            <Tab 
            className={classes.Tab} 
            label={<span>View History</span>} 
            icon={<EditIcon />}
            key={"View History"}
            />: 
            <></>
            }
            {user.category === "Admin" ? 
            <Tab 
            className={classes.Tab} 
            label={<span>Edit Parking Space</span>} 
            icon={<EditIcon />}
            key={"Edit Parking Space"}
            />: 
            <></>
            }
        </Tabs>
      </AppBar> 
      </div>
      <main className={classes.content}>
        {
          selectedMode === "Dashboard" ? <Dashboard /> : <></>
        }
        {
          selectedMode === "Book Parking Slot" ? <Booking changeSelectedMode = {setSelectedMode} changeIndicatortab = {setValue}/> : <></>
        }
        {
          selectedMode === "Edit Profile" ? <EditProfile changeSelectedMode = {setSelectedMode} changeIndicatortab = {setValue} /> : <></>
        }
        {
          selectedMode === "Update Parking" ? <UpdateBooking changeSelectedMode = {setSelectedMode} changeIndicatortab = {setValue} /> : <></>
        }
        {
          selectedMode === "View Parking Space" ? <ViewParkingSpace changeSelectedMode = {setSelectedMode} changeIndicatortab = {setValue} /> : <></>
        }
        {
          selectedMode === "Edit Parking Space" ? <EditParkSpace changeSelectedMode = {setSelectedMode} changeIndicatortab = {setValue} /> : <></>
        }
        {
          selectedMode === "View All Users" ? <ViewAllUsers changeSelectedMode = {setSelectedMode} changeIndicatortab = {setValue} /> : <></>
        }
        {
          selectedMode === "View History" ? <ViewHistory changeSelectedMode = {setSelectedMode} changeIndicatortab = {setValue} /> : <></>
        }
      </main>
    </div>
    
  )
}

export default Profile