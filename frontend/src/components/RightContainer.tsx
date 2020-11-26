
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import globalStore from '../store/global';
import userStore from '../store/user'
import MemberList from '../components/MemberList';
import Chatroom from './Chat/Chatroom'
import RightContainerHeader from './RightContainerHeader'
interface Props extends RouteComponentProps{
    //no props to send   
}

//The right hand container of the application. This component 
const RightContainer: React.FC<Props> = () => {
    const globalState = globalStore();
    const userState = userStore();
    //Gets the visible component depending on the state of the middle container
    const getVisibleComponent = (rightContainerState : string) => {
        return (rightContainerState === 'member' ? (
            <MemberList/>
        ): (
            <Chatroom groupId={userState.currentGroup?.id!} sessionId={userState.currentSessionData.session_uid!}/>
        ))
    };

    return (
        <div style={{padding: 15}}>
            <div style={{display:'flex', alignItems:'center', marginBottom:12}}>
                <RightContainerHeader/>
            </div>
            <div>
                {getVisibleComponent(globalState.rightContainer)}
            </div>
        </div>
    );
};

export default withRouter(RightContainer);