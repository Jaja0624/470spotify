import create from 'zustand';
import IGroup from '../types/IGroup'
import Cookies from 'js-cookie';
import { getGroupsHandler } from '../core/serverhandler'


type State = {
    validateAuthenticated: () => any,
    spotifyProfile: any,
    setSpotifyProfile: (blah: any) => void,
    userGroups: IGroup[],
    currentGroup?: IGroup,
    setCurrentGroup: (id: number) => void,
    setUserGroups: (userGroups: IGroup[]) => void,
    userPlaylists?: any[],
    setUserPlaylists: (playlists: any[]) => void,
    getAndUpdateUserGroups: () => void,
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
    userGroups: [ // static group data, to be replaced with what i just showed u 
    {
        id:14214,
        img_url:'https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg',
        name:'group1',
    }, 
    {
        id:141516,
        img_url:'https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg',
        name:'group2'
    }, 
    {
        id:15211254125,
        img_url:'https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg',
        name:'group3'
    }],
    currentGroup: undefined,
    setCurrentGroup: (id: number) => { // the most recent group selected from the group drawer
        console.log(id);
        set(state => ({
            currentGroup: state.userGroups.find((group: IGroup) => group.id === id) || undefined
        }))
    },
    getAndUpdateUserGroups: async () => {
        if (get().spotifyProfile?.id) {
            const groups = await getGroupsHandler(get().spotifyProfile.id);
            if (groups) {
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
    }
    
}))


export default userStore;