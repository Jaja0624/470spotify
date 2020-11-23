
interface IActiveSession {
    group_uid: string,
    is_active: boolean,
    session_uid: number,
    spotify_playlist_uri: string
}

export default interface IGroup {
    id: string,
    img_url?: string,
    name: string,
    active?: IActiveSession
}