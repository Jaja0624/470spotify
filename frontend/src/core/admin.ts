import axios, {AxiosResponse} from 'axios'

export const verifyAdmin = async (password: string): Promise<AxiosResponse> => {
    const body = {
        password
    }
    return await axios.post('/api/admin/login', body);
}
