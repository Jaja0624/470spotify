import React, { useState } from 'react';
import shallow from 'zustand/shallow'
import userStore from '../../store/user'
import globalStore from '../../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Grid, Button,Typography, IconButton, List } from '@material-ui/core';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import CreateGroupModal from '../CreateGroupModal'
import GroupList from './GroupList'
import KeyboardArrowLeftTwoToneIcon from '@material-ui/icons/KeyboardArrowLeftTwoTone';
import axios from 'axios';

interface Props extends RouteComponentProps {

}

// create group popup
const GroupDrawer: React.FC<Props> = ({history}: Props) => {
    const handleOpen = () => {
        console.log("hh")
    }

    const createGroupHandler = async (groupName: string) => {
        console.log(groupName);
        console.log('group created...' + groupName);
        setCreateGroupModalVisible(false);
        let old = userState.userGroups
        old.push({    
            id: Math.floor(Math.random()*1000),
            img_url: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg',
            name: groupName
        })
        userState.setUserGroups(old);
        let body = {groupName}
        const res = axios.post('http://localhost:5000/api/group/create', body);
        console.log(res);
    }
    const classes = useStyles();
    const userState = userStore();
    const {
        isGroupDrawerOpen, 
        hideGroupDrawer, 
        openGroupDrawer
    } = globalStore(state => ({ 
        isGroupDrawerOpen: state.isGroupDrawerOpen, 
        hideGroupDrawer: state.hideGroupDrawer,
        openGroupDrawer: state.openGroupDrawer,
    }), shallow);

    const [createGroupModalVisible, setCreateGroupModalVisible] = useState(false);

    return (
        <div className={classes.drawer}>
            <Typography variant="h6" className={classes.title}>
                Groups
                <IconButton style={{float:'right'}} onClick={hideGroupDrawer}>
                    <KeyboardArrowLeftTwoToneIcon/>
                </IconButton>
            </Typography>
            
            <div style={{padding: 15}}>
                <IconButton
                        edge="end"
                        aria-label="addGroup"
                        className={`${classes.addGroup}`}
                        onClick={() => setCreateGroupModalVisible(true)}>
                <AddIcon />
                <Typography variant='subtitle1'>
                    Create Group
                </Typography>
                </IconButton>
            </div>
     

            <div style={{paddingTop: 25}}>
                <GroupList/>
            </div>



            <CreateGroupModal isOpen={createGroupModalVisible} 
                                cancelHandler={() => setCreateGroupModalVisible(false)}
                                saveHandler={createGroupHandler}/>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            textAlign:'center',
            justifyContent:'center',
            alignItems:'center',
        },
        drawer: {
            height: '100%',
            color: 'white',
            backgroundColor: theme.drawer.backgroundColor,
            textAlign:'center',
            justifyContent:'center',
            alignItems:'center',
        },
        title: {
            textAlign:'left',
            paddingLeft: 15,
            paddingTop:15,

        },
        addGroup: {
            float: 'left',
        },

    }),
);

export default withRouter(GroupDrawer) // withRouter enables us to use the router even though this component is not a "Route"