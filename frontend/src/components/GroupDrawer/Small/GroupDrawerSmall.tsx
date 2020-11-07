import React, { useState } from 'react';
import shallow from 'zustand/shallow'
import userStore from '../../../store/user'
import globalStore from '../../../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography, IconButton } from '@material-ui/core';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import CreateGroupModal from '../../CreateGroupModal'
import GroupListSmall from './GroupListSmall'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

interface Props extends RouteComponentProps {}

// create group popup
const GroupDrawerSmall: React.FC<Props> = ({history}: Props) => {
    const handleOpen = () => {
        console.log("hh")
    }

    const createGroupHandler = (groupName: string) => {
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
                <IconButton onClick={openGroupDrawer}>
                    <KeyboardArrowRightIcon/>
                </IconButton>
            </Typography>
            
            <div style={{padding: 15}}>
                <IconButton
                        edge="end"
                        aria-label="addGroup"
                        className={`${classes.addGroup}`}
                        onClick={() => setCreateGroupModalVisible(true)}>
                <AddIcon />
                </IconButton>
            </div>
     

            <div style={{paddingTop: 25, textAlign:'center'}}>
                <GroupListSmall/>
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

        },
        drawer: {
            height: '100%',
            width: '6vh',
            color: 'white',
            backgroundColor: theme.drawer.backgroundColor,
        },
        title: {
            textAlign:'left',
            paddingLeft: 2,
            paddingTop: 15,

        },
        addGroup: {
            float: 'left',
        },

    }),
);

export default withRouter(GroupDrawerSmall) // withRouter enables us to use the router even though this component is not a "Route"