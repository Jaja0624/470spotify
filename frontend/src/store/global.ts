import { IndeterminateCheckBox } from '@material-ui/icons';
import create from 'zustand';
interface ITrack {
    artists: string | string[],
    durationMs: number,
    id: string,
    image: string,
    name: string,
    uri: string
}

type State = {
    isGroupDrawerOpen: boolean,
    hideGroupDrawer: () => void,
    openGroupDrawer: () => void
    middleContainer: string, 
    rightContainer: string,
    setMiddleContainer: (container: string) => void,
    setRightContainer: (container: string) => void,
    rightContainerIndex: number,
    setRightContainerIndex: (index: number) => void,
    groupInvite: any | undefined,
    setGroupInvite: (groupId?: number) => void,
    tracksToPlay: string[],
    setTracksToPlay: (tracks: string[]) => void,
    playing: boolean,
    setPlaying: (play: boolean) => void,
    startPlaying: () => void,
    stopPlaying: () => void,
    currentTrack: ITrack | null,
    setCurrentTrack: (track: ITrack) => void,
    playTimer: number,
    resetPlayTimer: () => void,
    prevTrack: ITrack | null

}

const globalStore = create<State>((set, get) => ({
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
    rightContainer: 'member',
    setMiddleContainer: (container: string) => {
        set({middleContainer: container})
    },
    setRightContainer: (container: string) => {
        set({rightContainer: container})
    },
    rightContainerIndex: 1,
    setRightContainerIndex: (index: number) => {
        set({rightContainerIndex: index})
    },
    groupInvite: undefined, // {groupId: groupId}
    setGroupInvite: (groupId?: number) => {
        set({groupInvite: {groupId}})
    },
    tracksToPlay: [],
    setTracksToPlay: (tracks: string[]) => {
        console.log("old tracks", get().tracksToPlay)
        set({tracksToPlay: tracks})
        console.log("new tracks set", get().tracksToPlay);
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
    },
    playTimer: 0,
    resetPlayTimer: () => {
        set({playTimer: 0})
    },
    currentTrack: null,
    prevTrack: null,
    setCurrentTrack: (track: ITrack) => {
        console.log("setting track", track);
        if (get().prevTrack) {
            set({prevTrack: get().currentTrack})
        }
        set({currentTrack: track})
    },
}))

export default globalStore;