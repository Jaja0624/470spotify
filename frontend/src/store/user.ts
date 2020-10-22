import create from 'zustand';

type State = {
    authenticated: boolean,
    login: (cb: any) => void,
    logout: (cb: any) => void
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
    }
}))


export default userStore;