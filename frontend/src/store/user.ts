import create from 'zustand';
import IGroup from '../types/IGroup'
import Cookies from 'js-cookie';
import { getGroupsHandler } from '../core/serverhandler'
import { getActive, getActiveAll } from '../core/server'
import { getPlaylist } from '../core/spotify'
import { AxiosResponse } from 'axios';
import { ISessionData } from '../types/ISessionData'
import { followPlaylist } from '../core/spotify'

type EmptyObject = {
    [K in any] : never
}

type State = {
    validateAuthenticated: () => any,
    spotifyProfile: any,
    setSpotifyProfile: (blah: any) => void,
    userGroups: IGroup[],
    currentGroup?: IGroup,
    setCurrentGroup: (id: string) => void,
    getCurrentGroup: () => any,
    setUserGroups: (userGroups: IGroup[]) => void,
    userPlaylists?: any[],
    setUserPlaylists: (playlists: any[]) => void,
    getAndUpdateUserGroups: () => void,
    createSessionInfo: any,
    setCreateSessionInfo: (info: any) => void,  
    currentSessionData: ISessionData | EmptyObject,
    getActiveSession: () => void,
    currentSessionPlaying: number,
    setCurrentSessionPlaying: (session_uid: number) => void,
    allPublicSessions: ISessionData[],
    getAllPublicSessions: () => void
    searchQuery: string,
    setSearchQuery: (query: string) => void,
    spotifyDeviceId: string,
    setSpotifyDeviceId: (id: string) => void,
    updateCurrentSessionDataPlaylist: () => void
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
    getCurrentGroup: () => {
        return get().currentGroup
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
    createSessionInfo: {} as any,
    setCreateSessionInfo: (info: any) => {
        set({createSessionInfo:  {
            ...get().createSessionInfo,
            ...info
        }})
    },
    currentSessionData: {},
    getActiveSession: async () => {
        console.log('getting active session')
        if (get().currentGroup == undefined) {
            return;
        }
        const sessionData = await getActive(get()?.currentGroup?.id!, get().spotifyProfile.id);
        if (sessionData && sessionData?.data && sessionData?.data?.spotify_playlist_uri) {
            console.log("ACTIVE");
            const playlistData: AxiosResponse = await getPlaylist(Cookies.get('spotifytoken')!, sessionData?.data?.spotify_playlist_uri)
            console.log("getActiveSession", "playlist data response", playlistData)
            // get playlist songs
            set({currentSessionData: {
                ...get().currentSessionData,
                ...sessionData.data,
                playlist: playlistData.data
            }})
            try {
                await followPlaylist(Cookies.get('spotifytoken')!, playlistData.data.id)
            } catch (err) {
                console.log('not followed')
            }
            console.log("session + playlist data", get().currentSessionData);
        } else {
            console.log("failed to get an active session. Session results", sessionData);
            set({currentSessionData: {}})
            set({currentSessionPlaying: -1})
        }
    },
    updateCurrentSessionDataPlaylist: async () => {
        const playlistRes: AxiosResponse = await getPlaylist(Cookies.get('spotifytoken')!, get().currentSessionData.playlist.id)
        const playlistData = playlistRes.data
        const oldSessionData: ISessionData | EmptyObject = get().currentSessionData
        console.log("getActiveSession412412412412414", playlistData)
        // get playlist songs
        set({currentSessionData: {
            ...oldSessionData,
            playlist: playlistData
        }})
        // get().currentSessionData.playlist = playlistData.data
        // set({currentSessionData: {
        //     ...get().currentSessionData,
        //     playlist: playlistData.data
        // }})
    },
    currentSessionPlaying: -1,
    setCurrentSessionPlaying: (session_uid: number) => {
        set({currentSessionPlaying: session_uid})
    },
    allPublicSessions: [],
    getAllPublicSessions: async () => {
        try {
            const res = await getActiveAll(Cookies.get('spotifytoken')!)
            console.log('all public sessions', res)
        } catch (err) {
            console.log('all public sessions', err)
        }
    },
    searchQuery: '',
    setSearchQuery: (query: string) => {
        set({searchQuery: query})
    },
    spotifyDeviceId: '',
    setSpotifyDeviceId: (id: string) => {
        set({spotifyDeviceId: id})
    }
}))

export default userStore;