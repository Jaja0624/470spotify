
export interface joinChatData {
    group_uid: string,
    spotify_uid: string,
    name: string
}

export interface messageData {
    group_uid: string,
    type: "msg" | "status",
    author: string,
    msg: string
}

export interface playerState {
    isActive: boolean,
    isPlaying: boolean,
    track: any, // current track being played
    nextTracks: [],
    previousTracks: [],
    position: number,
    [key: string]: any // rest
}

export interface playlistData {
    spotify_playlist_uri: string
}