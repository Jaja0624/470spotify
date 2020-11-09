import React, { useState } from 'react';
import shallow from 'zustand/shallow'
import userStore from '../../store/user'
import globalStore from '../../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Grid, Button,Typography, IconButton, List, Container } from '@material-ui/core';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import CreateGroupModal from '../CreateGroupModal'
import GroupList from './GroupList'
import KeyboardArrowLeftTwoToneIcon from '@material-ui/icons/KeyboardArrowLeftTwoTone';
import axios from 'axios';
import IGroup from '../../types/IGroup'

interface Props extends RouteComponentProps {}

// create group popup
const GroupDrawer: React.FC<Props> = ({history}: Props) => {
    const user = userStore();
    const getGroup = async ()  => {
		const res = await axios.get('http://localhost:5000/api/group/all');
		console.log("group dataaaaaaaaaaaaaaaaaa", res.data); // here is the group data
		const groups: Array<IGroup> = [];
		for (let i = 0; i < res.data.length; i++) {
			let newG = {
				id: res.data[i].group_uid,
				name: res.data[i].group_name,
				img_url: undefined
			}
			groups.push(newG);
		}
		user.setUserGroups(groups);
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
        await getGroup();
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
            <Grid container 
                justify='space-between' 
                alignItems='center' // CENTER TEXT VERTICALLY
                direction='row'
                className={classes.containers}>
                <Typography variant="h6" >
                    Groups
                </Typography>
                <IconButton onClick={hideGroupDrawer}>
                    <KeyboardArrowLeftTwoToneIcon/>
                </IconButton>
            </Grid>
        
            <Grid container
                justify='space-between'
                alignItems='center'
                direction='row'>
                <IconButton
                        edge="end"
                        aria-label="addGroup"
                        onClick={() => setCreateGroupModalVisible(true)}>
                <AddIcon />
                <Typography variant='subtitle1'>
                    Create
                </Typography>

                </IconButton>
            </Grid>
            
            <GroupList/>

            <CreateGroupModal isOpen={createGroupModalVisible} 
                                cancelHandler={() => setCreateGroupModalVisible(false)}
                                saveHandler={createGroupHandler}/>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawer: {
            height: '100%',
            width:'100%',
        },
        containers:{
            paddingLeft:15,
        }


    }),
);

export default withRouter(GroupDrawer) // withRouter enables us to use the router even though this component is not a "Route"