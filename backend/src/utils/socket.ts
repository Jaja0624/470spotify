

export const chatRoomKey = (groupId: string): string => {
    return groupId + "/chat"
}

export const sessionKey = (sessionId: string): string => {
    return sessionId + "/session"
}