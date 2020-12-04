export interface ISessionData {
    group_uid: string,
    is_active: boolean,
    session_uid: number,
    spotify_playlist_uri: string,
    playlist: any,
    [key: string]: any,
    description: string
}