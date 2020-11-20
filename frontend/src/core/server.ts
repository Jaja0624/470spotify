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

export const createSession = async (groupId: string, createSessionInfo: any) => {
    console.log("createSession TBD groupId", groupId);
    console.log("createSession TBD info", createSessionInfo);
}