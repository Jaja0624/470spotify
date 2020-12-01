import axios, {AxiosResponse} from 'axios'

export const verifyAdmin = async (password: string): Promise<AxiosResponse> => {
    const body = {
        password
    }
    return await axios.post('/api/admin/login', body);
}

export const getTable = async (tableId: number): Promise<AxiosResponse> => {
    const body = {
        tableId
    }

    switch (tableId) {
        case 0:
            return await axios.post('/api/admin/appuser');
        case 1:
            return await axios.post('/api/admin/appgroup');
        case 2:
            return await axios.post('/api/admin/groupmember');
        case 3:
            return await axios.post('/api/admin/appsession');
        case 4:
            return await axios.post('/api/admin/sessionadmin');
        default:
            return await axios.post('/api/admin/apphistory');
    }
}
