import axios, {AxiosResponse} from 'axios'

export const getUserProfile = async (accessToken: string): Promise<AxiosResponse> => {
    return await axios.get('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

