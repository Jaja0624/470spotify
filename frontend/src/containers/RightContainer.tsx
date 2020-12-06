
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';

import userStore from '../store/user';
import globalStore from '../store/global';
import MemberList from '../components/MemberList';
import GroupPlaylistHistory from '../components/GroupPlaylistHistory';
import { Tab, Tabs } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import SettingsIcon from '@material-ui/icons/Settings';
import ChatIcon from '@material-ui/icons/Chat';
import Chatroom from '../components/Chat/Chatroom';

interface Props extends RouteComponentProps{
    //no props to send   
}

// The right hand container of the application. This component manages the additional 
// information of the group like its member list, playlist history, and group settings.
const RightContainer: React.FC<Props> = () => {
    const globalState = globalStore();
    const userState = userStore();

    const handleChange = (event : any, newValue: number) => {
        globalState.setRightContainerIndex(newValue);
    };

    const rightContainerShow = () => {
        if (globalState.rightContainerIndex === 0) {
            return <Chatroom/>
        } else if (globalState.rightContainerIndex === 1) {
            return <MemberList/>
        } else if (globalState.rightContainerIndex === 2) {
            return <GroupPlaylistHistory/>
        } else {
            return <div>Error</div>
        }
    }

    return (
        <div>
            <Tabs value={globalState.rightContainerIndex} onChange={handleChange} aria-label="simple tabs example" variant="fullWidth"
                scrollButtons="on" >
                <Tab style={{ minWidth: 25 }} icon={<ChatIcon/>}/>
                <Tab style={{ minWidth: 25 }} icon={<PeopleIcon/>}/>
                <Tab style={{ minWidth: 25 }} icon={<LibraryMusicIcon/>}/>
                {/* Commented out for demonstration purposes. */}
                {/* <Tab style={{ minWidth: 25 }} icon={<SettingsIcon/>} label="Placeholder"/> */}
            </Tabs>
            {rightContainerShow()}
        </div>
    );
};

export default withRouter(RightContainer);