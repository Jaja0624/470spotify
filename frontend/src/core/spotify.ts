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

export const followPlaylist = async (accessToken: string, playlistId: string): Promise<AxiosResponse> => {
    const headers = {
        headers: { Authorization: `Bearer ${accessToken}` },
        'Content-Type': 'application/json',
        
    }
    return await axios.put(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {}, headers)
}

export const getSearchResults = async (accessToken: string, query: string): Promise<AxiosResponse> => {
    var concatQuery = query.replace(' ', '%20');
    return await axios.get(`https://api.spotify.com/v1/search?q=${concatQuery}&type=track`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

export const addTrackToPlaylist = async (accessToken: string, playlistId: string, track: string): Promise<AxiosResponse> => {
    const headers = {
        headers: { 
            'Authorization': `Bearer ${accessToken}`,
        }
    }

    const body = {
        'uris': [`${track}`]
    }
    
    return await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, body, headers)
}

export const removeTracksFromPlaylist = async (accessToken: string, playlistId: string, track: string): Promise<AxiosResponse> => {
    const request = {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        data: {
            'tracks': [
                {
                'uri': `${track}`
                }
            ]
        }
    }

    return await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, request)
}

export const getCurrentPlayback = async (accessToken: string): Promise<AxiosResponse> => {
    return await axios.get(`https://api.spotify.com/v1/me/player`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }     
    })
}

export const playSong = async (accessToken: string, deviceId: string, trackUri: string[], time: number) => {

    var tmp = {
        "uris": trackUri,
        "position_ms": time
    };

    var body = JSON.stringify(tmp);
    // axios doesn't work when doing PUT requests for Spotify
    return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        body,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        method: 'PUT',
    });
}

export const pausePlayback = async (accessToken: string, deviceId: string) => {

    // axios doesn't work when doing PUT requests for Spotify
    return fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        method: 'PUT',
    });
}

export const resumePlayback = async (accessToken: string, deviceId: string) => {

    // axios doesn't work when doing PUT requests for Spotify
    return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        method: 'PUT',
    });
}

export const skipForwardPlayback = async (accessToken: string, deviceId: string) => {

    // axios doesn't work when doing PUT requests for Spotify
    return fetch(`https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        method: 'POST',
    });
}

export const skipPreviousPlayback = async (accessToken: string, deviceId: string) => {

    // axios doesn't work when doing PUT requests for Spotify
    return fetch(`https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        method: 'POST',
    });
}

export const seekPlayback = async (accessToken: string, deviceId: string, time: number) => {

    // axios doesn't work when doing PUT requests for Spotify
    return fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${time}&device_id=${deviceId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        method: 'PUT',
    });
}

export const changeVolume = async (accessToken: string, deviceId: string, volume: number) => {

    // axios doesn't work when doing PUT requests for Spotify
    return fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}&device_id=${deviceId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        method: 'PUT',
    });
}

export const playPlaylist = async (accessToken: string, deviceId: string, playlistUri: string, index: number) => {

    var tmp = {
        "context_uri": playlistUri,
        "offset": {
          "position": index
        },
        "position_ms": 0
    };

    var body = JSON.stringify(tmp);
    // axios doesn't work when doing PUT requests for Spotify
    return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        body,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        method: 'PUT',
    });
}
