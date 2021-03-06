import axios, {AxiosResponse} from 'axios'

// requests to our server

export const getUserGroups = async (id: string): Promise<AxiosResponse> => {
	return await axios.get('/api/user/groups', {params: {id}});
}

export const createGroup = async (groupData: any): Promise<AxiosResponse> => {
    return await axios.post('/api/group/create', groupData);
}

export const joinGroup = async (groupId: string, spotifyId: string): Promise<AxiosResponse> => {
    const body = {
        groupId,
        spotifyId
    }
    return await axios.post('/api/group/join', body);
}

export const leaveGroup = async (groupId: string, spotifyId: string): Promise<AxiosResponse> => {
    const body = {
        groupId,
        spotifyId
    }
    return await axios.post('/api/group/leave', body);
}

export const getMembers = async (groupId: string): Promise<AxiosResponse> => {
    return await axios.get('/api/group/members', {
        params: {
            groupId
        }
    })
}

//Gets the history session playlist from the backend
export const getHistorySessionPlaylists = async (accessToken: string, groupId: number): Promise<AxiosResponse> => {
    return await axios.get('/api/group/historySessionPlaylists', {
        params: {
            groupId: groupId,
            accessToken: accessToken
        }
    })
}

// data.session_uid : new app session
// data.playlist_id : new playlist created
export const createSession = async (accessToken: string, groupId: string, spotifyId: string, createSessionInfo: any, createNewPlaylist: boolean, isPublic: boolean, description: string) => {
    console.log("createSession TBD groupId", groupId);
    console.log("createSession TBD info", createSessionInfo);
    const body = {
        accessToken: accessToken,
        groupUid: groupId,
        spotifyId,
        createSessionInfo,
        createNewPlaylist,
        isPublic,
        description: description
    }
    return await axios.post('/api/session/create', body)
}

export const endSession = async (accessToken: string, sessionUid: number, unfollow: boolean, playlistId: string) => {
    const body = {
        accessToken,
        sessionUid,
        unfollow,
        playlistId
    }
    return await axios.post(`/api/session/stop`, body)
}

// data.session_uid : new app session
// data.playlist_id : new playlist created
export const getActive = async (groupId: string, spotifyId: string) => {
    return await axios.get('/api/session/active', {
        params: {
            spotifyId,
            groupUid: groupId
        }
    })
}

export const getActiveAll = async (accessToken: string) => {
    return await axios.get('/api/session/activeAll', {params: {accessToken}})
}