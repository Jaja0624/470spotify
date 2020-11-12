import axios, {AxiosResponse} from 'axios'

// requests to our server

export const getUserGroups = async (): Promise<AxiosResponse> => {
    return await axios.get('/api/group/all');
}

export const createGroup = async (groupData: any): Promise<AxiosResponse> => {
    return await axios.post('/api/group/create', groupData);
}