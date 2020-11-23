import axios, {AxiosResponse} from 'axios'

export const getUserProfile = async (accessToken: string): Promise<AxiosResponse> => {
    return await axios.get('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

// all playlists of user
export const getPlaylists = async (accessToken: string, clientId: string): Promise<AxiosResponse> => {
    return await axios.get(`https://api.spotify.com/v1/users/${clientId}/playlists`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

// specific playlist details 
export const getPlaylist = async (accessToken: string, playlistId: string): Promise<AxiosResponse> => {
    return await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}
