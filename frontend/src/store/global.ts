import create from 'zustand';

type State = {
    isGroupDrawerOpen: boolean,
    hideGroupDrawer: () => void,
    openGroupDrawer: () => void

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
    

}))


export default globalStore;