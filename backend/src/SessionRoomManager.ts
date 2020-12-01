import Users from './GenericList'

class SessionRoomManager {
    groupSessions: {[key: string]: Users};
    
    constructor() {
        this.groupSessions = {};
    }

    hasSession(group_uid: string) {
        return group_uid in this.groupSessions;
    }

    addUser(group_uid: string, spotify_uid: string) {
        if (!(group_uid in this.groupSessions)) {
            this.groupSessions[group_uid] = new Users();
        } 
        this.groupSessions[group_uid].add(spotify_uid);
    }

    removeUser(group_uid: string, spotify_uid: string) {
        if (group_uid in this.groupSessions) {
            this.groupSessions[group_uid].delete(spotify_uid);
            // delete session if empty
            if (this.groupSessions[group_uid].allItems().length == 0) {
              delete this.groupSessions[group_uid]
            }
        } 
    }
    
    // finds user and remove them from any session
    removeUserAllGroups(spotify_uid: string) {
        for (let [groupId, groupSessionUsers] of Object.entries(this.groupSessions)) {
            if (groupSessionUsers.list.includes(spotify_uid)) {
                groupSessionUsers.delete(spotify_uid);
                // delete session if empty
                if (groupSessionUsers.allItems().length == 0) {
                  delete this.groupSessions[groupId]
                }
                return groupId
            }
        }
        return ''
    }
    
    endSession(group_uid: string) {
        delete this.groupSessions[group_uid]
    }

    usersInSession(group_uid: string) {
        return this.groupSessions[group_uid]
    }

    all() {
        return this.groupSessions
    }

}

const SessionRoomManagerInstance = new SessionRoomManager();

export default SessionRoomManagerInstance;