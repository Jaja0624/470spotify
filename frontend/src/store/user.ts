import create from 'zustand';
import IGroup from '../types/IGroup'
import Cookies from 'js-cookie';
import { getGroupsHandler } from '../core/serverhandler'
import { getActive } from '../core/server'
import { getPlaylistItems } from '../core/spotify'

type State = {
    validateAuthenticated: () => any,
    spotifyProfile: any,
    setSpotifyProfile: (blah: any) => void,
    userGroups: IGroup[],
    currentGroup?: IGroup,
    setCurrentGroup: (id: string) => void,
    setUserGroups: (userGroups: IGroup[]) => void,
    userPlaylists?: any[],
    setUserPlaylists: (playlists: any[]) => void,
    getAndUpdateUserGroups: () => void,
    createSessionInfo: any,
    setCreateSessionInfo: (info: any) => void,
    currentSessionData: {},
    getActiveSession: () => void
}

const userStore = create<State>((set, get)=> ({
    validateAuthenticated: () => {
        return Cookies.get('spotifytoken');
    },
    spotifyProfile: undefined,
    setSpotifyProfile: (spotifyProfile: any) => { 
        console.log("setting spotify profile", spotifyProfile)
        set({spotifyProfile : spotifyProfile})
        console.log("updated spotify profile", get().spotifyProfile)
    },
    userGroups: [],
    currentGroup: undefined,
    setCurrentGroup: (id: string) => { // the most recent group selected from the group drawer
        if (id === "") {
            set({currentGroup: undefined})
            return;
        }
        console.log(id);
        set(state => ({
            currentGroup: state.userGroups.find((group: IGroup) => group.id === id) || undefined
        }))
    },
    getAndUpdateUserGroups: async () => {
        if (get().spotifyProfile?.id) {
            const groups = await getGroupsHandler(get().spotifyProfile.id);
            if (groups) {
                console.log("updating user groups state");
                set(state => ({
                    userGroups: groups
                }))
            }
        }
    },
    setUserGroups: (userGroups: IGroup[]) => { // via this function since u cannot modify state directly
        set(state => ({userGroups: userGroups}))
    },
    userPlaylists: undefined,
    setUserPlaylists: (playlists: any[]) => {
        set(state => ({userPlaylists: playlists}))
    },
    createSessionInfo: {},
    setCreateSessionInfo: (info: any) => {
        set({createSessionInfo:  {
            ...get().createSessionInfo,
            ...info
        }})
    },
    currentSessionData: {},
    getActiveSession: async () => {
        if (get().currentGroup == undefined) {
            return;
        }
        const sessionData = await getActive(get()?.currentGroup?.id!, get().spotifyProfile.id);
        if (sessionData) {
            console.log("ACTIVE");
            console.log(sessionData)
            const playlistItems = await getPlaylistItems(Cookies.get('spotifytoken')!, sessionData.data[0].spotify_playlist_uri)
            // get playlist songs
            set({currentSessionData: {
                ...get().currentSessionData,
                ...sessionData,
                ...playlistItems.data
            }})
            console.log(get().currentSessionData);
        }

    }
}))


export default userStore;