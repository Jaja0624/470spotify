

export const chatRoomKey = (groupId: string): string => {
    return groupId + "/chat"
}

export const sessionKey = (groupId: string | number): string => {
    return groupId + "/session"
}
