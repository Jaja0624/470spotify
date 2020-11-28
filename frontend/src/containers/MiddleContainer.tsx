import React, { useEffect, useState } from 'react';
import userStore from '../store/user'
import globalStore from '../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Button, Snackbar } from '@material-ui/core';
import UserPlaylists from '../components/UserPlaylists'
import GroupInviteLinkModal from '../components/GroupInviteLinkModal'
import { getMembers, leaveGroup } from '../core/server'
import Cookies from 'js-cookie';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import StartSessionModal from '../components/StartSessionModal'
import { createSession } from '../core/server'
import SessionContainer from './SessionContainer'
import MiddleContainerHeader from '../components/MiddleContainerHeader'
import { socket } from '../core/socket'
import CustomSnackbar from '../components/CustomSnackbar'

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
    const [error, setError] = useState({state: false, msg: ''});

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

    const createSessionHandler = async (createNewPlaylist: boolean) => {
        setStartSessionModalVisible(false)
        // TBD: handle creating session in backend, setting up playlist on spotify profile...
        if (userState?.currentGroup?.id) {
            console.log("create new playlist", createNewPlaylist);
            try {
                const res = await createSession(Cookies.get('spotifytoken')!, userState?.currentGroup?.id, userState?.spotifyProfile.id, userState?.createSessionInfo); 
                if (res.status == 201) {
                    await userState.getAndUpdateUserGroups()
                    globalState.setMiddleContainer('session');
                }
            } catch (err) {
                console.log(err);
            }

            // send session id instead?
            setSession(true);
        }
    }

    const sessionActiveCheck = () => {
        for (let i = 0; i < userState.userGroups.length; i++) {
            if (userState.currentGroup?.id === userState.userGroups[i].id && userState.userGroups[i]?.active?.is_active) {
                setError({state: true, msg: 'A session is already active'})
                return;
            }
        }
        setStartSessionModalVisible(true)
    }
    const ifhandler = () => {
        if (globalState.middleContainer === 'group' && userState.currentGroup) {
            return (
                <div>
                    <div style={{display:'flex', alignItems:'center', marginBottom:12}}>
                        <MiddleContainerHeader/>
                    </div>
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
                    <Button variant='text' color='primary' size='large' onClick={sessionActiveCheck}>
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
        } else if (globalState.middleContainer === 'session') {
            return <SessionContainer/>
        } else {
            return <UserPlaylists/>
        }
    }

    return (
        <div className={classes.root}>
            <CustomSnackbar open={error.state} text={error.msg} close={() => setError({state: false, msg: ''})} type='error'/>
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