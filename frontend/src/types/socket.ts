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