import React, { useEffect, useState } from 'react';
import userStore from '../store/user'
import globalStore from '../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Button } from '@material-ui/core';
import UserPlaylists from './UserPlaylists'
import GroupInviteLinkModal from './GroupInviteLinkModal'
import { getMembers, leaveGroup } from '../core/server'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import StartSessionModal from './StartSessionModal'
import { createSession } from '../core/server'
const io = require('socket.io-client');
const socket = io();

// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {}

// FC (function component)
const MiddleContainer: React.FC<CustomPropsLol> = ({history}: CustomPropsLol) => {

    // when someone else has joined the same group, alert all members currently in session
    socket.on('connectToSession', function(data : any) {
        console.log("connectToSession data:", data);
    });

    const [session, setSession] = useState(false);

    useEffect(() => {
        console.log("session: " + session);
        if (session)
        {
            console.log("session exists");
            // send session id too?
            socket.emit('clientEvent', {'spotify_uid': userState.spotifyProfile.id, 'group_uid': userState.currentGroup?.id});
        }
    });

    const classes = useStyles();
    const userState = userStore();
    const globalState = globalStore();
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [startSessionModalVisible, setStartSessionModalVisible] = useState(false);

    async function leaveGroupAndUpdate() {
        if (userState?.currentGroup?.id) {
            const res = await leaveGroup(userState.currentGroup?.id, userState.spotifyProfile.id);
            await userState.getAndUpdateUserGroups()
            console.log("leave", res);
            globalState.setMiddleContainer('notgroup')
            userState.setCurrentGroup("");
        } else {
            console.log(userState?.currentGroup?.id);
        }
    }

    const createSessionHandler = (createNewPlaylist: boolean) => {
        setStartSessionModalVisible(false)
        // TBD: handle creating session in backend, setting up playlist on spotify profile...
        if (userState?.currentGroup?.id) {
            console.log("create new playlist", createNewPlaylist);
            createSession(userState?.currentGroup?.id, userState?.createSessionInfo);
            // send session id instead?
            setSession(true);
        }
    }

    const ifhandler = () => {
        if (globalState.middleContainer === 'group' && userState.currentGroup) {
            return (
                <div>
                    <div>
                        {userState.currentGroup.id}-
                        {userState.currentGroup.name}
                    </div>
                    
                    <div>
                        <Button color='primary' variant='contained' onClick={() => {
                            setInviteModalVisible(true);
                        }}>Invite Link</Button>
                    </div>

                    <div>
                        <Button color='primary' variant='contained' onClick={async () => {
                            await leaveGroupAndUpdate();
                        }}>Leave Group</Button>
                    </div>

                    <div>
                    <Button variant='text' color='primary' size='large' onClick={() => setStartSessionModalVisible(true)}>
                        Start Session
                        <PlayCircleFilledIcon/>
                    </Button>

                    <StartSessionModal
                        isOpen={startSessionModalVisible}
                        cancelHandler={() => setStartSessionModalVisible(false)}
                        saveHandler={createSessionHandler}
                        />

                    </div>
                    <GroupInviteLinkModal 
                        isOpen={inviteModalVisible}
                        cancelHandler={() => setInviteModalVisible(false)}
                        />
                </div>
            )
        } else {
            return (
                <UserPlaylists/>
            )
        }
    }

    return (
        <div className={classes.root}>
            {ifhandler()}
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            textAlign:'center',
            padding:15
        },
    }),
);

export default withRouter(MiddleContainer) // withRouter enables us to use the router even though this component is not a "Route"