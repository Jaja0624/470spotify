import create from 'zustand';

type State = {
    isGroupDrawerOpen: boolean,
    hideGroupDrawer: () => void,
    openGroupDrawer: () => void
    middleContainer: string, 
    setMiddleContainer: (container: string) => void,
    groupInvite: any | undefined,
    setGroupInvite: (groupId?: number) => void,
    tracksToPlay: string[],
    setTracksToPlay: (tracks: string[]) => void,
    playing: boolean,
    setPlaying: (play: boolean) => void,
    startPlaying: () => void,
    stopPlaying: () => void,

}

const globalStore = create<State>(set => ({
    isGroupDrawerOpen: true,
    hideGroupDrawer: () => {
        console.log('group drawer closed')
        set({isGroupDrawerOpen: false})
    },
    openGroupDrawer: () => {
        console.log('group drawer open')
        set({isGroupDrawerOpen: true})
    },
    middleContainer: 'user',
    setMiddleContainer: (container: string) => {
        set({middleContainer: container})
    },
    groupInvite: undefined, // {groupId: groupId}
    setGroupInvite: (groupId?: number) => {
        set({groupInvite: {groupId}})
    },
    tracksToPlay: [],
    setTracksToPlay: (tracks: string[]) => {
        set({tracksToPlay: tracks})
    },
    playing: false,
    setPlaying: (play: boolean) => {
        set({playing: play})
    },
    startPlaying: () => {
        set({playing: true})
    },
    stopPlaying: () => {
        set({playing: false})
    }
}))


export default globalStore;