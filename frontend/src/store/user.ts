import create from 'zustand';
import IGroup from '../types/IGroup'


type State = {
    authenticated: boolean,
    login: (cb: any) => void,
    logout: (cb: any) => void,
    spotifyProfile: any,
    setSpotifyProfile: (blah: any) => void,
    userGroups: IGroup[],
    currentGroup?: IGroup,
    setCurrentGroup: (id: number) => void,
    setUserGroups: (userGroups: IGroup[]) => void,
    userPlaylists?: any[],
    setUserPlaylists: (playlists: any[]) => void
}

const userStore = create<State>(set => ({
    authenticated: false, // primitive state
    login: (cb) => { // function that modifies state
        set(state => (
            {
                authenticated:true
            }
        ))
        cb()
    },
    logout: (cb) => { // function that modifies state
        set(state => (
            {
                authenticated:false
            }
        ))
        cb()
    },
    spotifyProfile: undefined,
    setSpotifyProfile: (blah: any) => { 
        console.log("setting spotify profile", blah)
        set(state => ({spotifyProfile: blah}))
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
    setCurrentGroup: (id: number) => { // the current group that the user is selected 
        console.log(id);
        set(state => ({
            currentGroup: state.userGroups.find((group: IGroup) => group.id === id) || undefined
        }))
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