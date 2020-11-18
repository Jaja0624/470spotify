import React, { useCallback, useEffect, useState } from 'react';
import userStore from '../store/user'
import globalStore from '../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Button } from '@material-ui/core';
import UserPlaylists from './UserPlaylists'
import GroupInviteLinkModal from './GroupInviteLinkModal'
import { getMembers, leaveGroup } from '../core/server'
import SpotifyPlayer from 'react-spotify-web-playback';
import { CallbackState } from 'react-spotify-web-playback/lib/types';
import Cookies from 'js-cookie';

// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {
    
}

// FC (function component)
const MiddleContainer: React.FC<CustomPropsLol> = ({history}: CustomPropsLol) => {
    const classes = useStyles();
    const userState = userStore();
    const globalState = globalStore();
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [play, setPlay] = useState(false);

    async function leaveGroupAndUpdate() {
        if (userState?.currentGroup?.id) {
            const res = await leaveGroup(userState.currentGroup?.id.toString(), userState.spotifyProfile.id);
            await userState.getAndUpdateUserGroups()
            console.log("leave", res);
            globalState.setMiddleContainer('notgroup')
            userState.setCurrentGroup(-1);
        } else {
            console.log(userState?.currentGroup?.id);
        }
    }

    const handleCallback = useCallback(({ type, ...state }: CallbackState) => {
        console.group(`RSWP: ${type}`);
        console.log(state);
        console.groupEnd();
        setPlay(state.isPlaying);
      }, []);

    const ifhandler = () => {
        if (globalState.middleContainer === 'group' && userState.currentGroup) {
            return (
                <div>
                    {userState.currentGroup.id}-
                    {userState.currentGroup.name}

                    <Button color='primary' variant='contained' onClick={() => {
                        setInviteModalVisible(true);
                    }}>Invite Link</Button>

                    <div>
                        <Button color='primary' variant='contained' onClick={async () => {
                            await leaveGroupAndUpdate();
                        }}>Leave Group</Button>
                    </div>
                    <div>
                        <SpotifyPlayer
                                token={Cookies.get('spotifytoken') as string}
                                uris={["spotify:artist:6HQYnRM4OzToCYPpVBInuU"]}
                                play={play}
                                callback={handleCallback}
                                />
                    </div>
                    <Button onClick={() => setPlay(false)}>STOP THE MUSIC</Button>

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