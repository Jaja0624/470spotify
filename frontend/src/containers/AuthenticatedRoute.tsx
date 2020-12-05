import React, {useEffect, useState}from 'react';
import {
    Route, 
    Redirect,
} from "react-router-dom";
import userStore from '../store/user'
import globalStore from '../store/global'
import Cookies from 'js-cookie';
import {getUserProfile, getPlaylists} from '../core/spotify';
import { joinGroup } from '../core/server';
import CircularProgress from '@material-ui/core/CircularProgress';
import { socket } from '../core/socket'

const AuthenticatedRoute = ({ component, redirectPath, ...rest}: any) => {
    const user = userStore();
    const globalState = globalStore();
    const [loading, setLoading] = useState(true);
    
    // verify user is logged in 
    const verifyAccessToken = async () => {
        const accessToken = Cookies.get('spotifytoken');
        if (accessToken) {
            console.log("access token found", accessToken);
            const userProfile = await getUserProfile(accessToken);
            const playlists = await getPlaylists(accessToken, userProfile.data.id)
            if (userProfile.status === 200) {
                user.setSpotifyProfile(userProfile.data);
                if (globalState.groupInvite) {
                    console.log("Invitation");
                    const joinGroupResult = await joinGroup(globalState.groupInvite.groupId, userProfile.data.id);
                    if (joinGroupResult.status === 200) {
                        await user.getAndUpdateUserGroups();
                        globalState.setMiddleContainer('group');
                        user.setCurrentGroup(globalState.groupInvite?.groupId);
                        const groupId = globalState.groupInvite?.groupId
                        globalState.setGroupInvite(undefined);
                        socket.emit('joinGroup', {
                            group_uid: groupId,
                            spotify_uid: userProfile.data.id,
                            name: userProfile.data.display_name
                        })
                    } else {
                        // TODO indicate to user failure
                        console.log('join group err')
                    }
                }
            } else {
                user.setSpotifyProfile(undefined);
            }
            if (playlists.status === 200) {
                user.setSpotifyProfile(userProfile.data);
                user.setUserPlaylists(playlists.data.items);
            } else {
                user.setUserPlaylists([]);
            }

            // check if user was invited to group, if so, set page to the new group
            console.log('groupInvite', globalState.groupInvite);
            
        } else {
            console.log('access token not found');
        }
    }

    useEffect(() => {
        async function test() {
            await verifyAccessToken();
            setLoading(false);

        }
        test();

    }, [])

    // const routeComponent = (props: any) => (
    //     user.spotifyProfile
    //         ? React.createElement(component, props)
    //         : <Redirect to={{pathname: redirectPath}}/>
    // );

    if (loading) {
        return (
            <div>
                <CircularProgress/>
            </div>

        )
    } else {
        return (
            <Route {...rest} render={(props: any) => (
                user.spotifyProfile 
                ? (
                    React.createElement(component, props)
                ) : (
                    <Redirect to={{pathname: redirectPath}}/>
                )
            )}/>
        )
    }
}

export default AuthenticatedRoute;