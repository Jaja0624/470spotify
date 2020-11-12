import axios, {AxiosResponse} from 'axios'

// requests to our server

export const getUserGroups = async (): Promise<AxiosResponse> => {
	return await axios.get('/api/user/groups', {params: {id: "prq2vz0ahfeet3o4lsonysgjn"}});
}

export const createGroup = async (groupData: any): Promise<AxiosResponse> => {
    return await axios.post('/api/group/create', groupData);
}