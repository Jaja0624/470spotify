
class SessionUsers {
    users: string[];
    constructor() {
        this.users = [];
    }

    add(spotify_uid: string) {
        this.users.push(spotify_uid);
    }

    delete(spotify_uid: string) {
        this.users = this.users.filter(user_spotify_uid => user_spotify_uid === spotify_uid)
    }
    

    allUsers() {
        return this.users
    }
}

export default SessionUsers;