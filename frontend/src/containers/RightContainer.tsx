
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

    // Determines what component to show for the group.
    const [rightContainerState, setRightContainerState] = useState(1);

    const handleChange = (event : any, newValue: number) => {
        setRightContainerState(newValue);
    };

    //Gets the visible component depending on the state of the middle container
    const getVisibleComponent = (middleContainerState : string) => {
        return(
            <div>
                <Tabs value={rightContainerState} onChange={handleChange} aria-label="simple tabs example" variant="fullWidth"
                    scrollButtons="on" >
                    <Tab icon={<ChatIcon/>}/>
                    <Tab icon={<PeopleIcon/>}/>
                    <Tab icon={<LibraryMusicIcon/>}/>
                    <Tab icon={<SettingsIcon/>} label="Placeholder"/>
                </Tabs>
                <div style={{padding:15}}> 
                    <Chatroom groupId={userState.currentGroup?.id!} sessionId={userState.currentSessionData.session_uid!} tabState={rightContainerState} index={0}/>
                    <MemberList tabState={rightContainerState} index={1}/>
                    <GroupPlaylistHistory tabState={rightContainerState} index={2}/>
                </div>
            </div>
        );
    };

    return (
        <div>
            {getVisibleComponent(globalState.middleContainer)}
        </div>
    );
};

export default withRouter(RightContainer);