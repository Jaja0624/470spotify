
interface userData {
    spotify_uid: string,
    pro_pic: string // url
}

class SocketClientManager {
    users: any;
    constructor() {
        this.users = {};
    }

    add(socket_id: string, data: userData) {
        this.users[socket_id] = data;
    }

    remove(socket_id: string) {
        const userData = this.users[socket_id]
        console.log("USER DATA", userData)
        delete this.users[socket_id];
        return userData
    }

    getUser(spotify_uid: string) {
        Object.entries((user: userData) => {
            if (user.spotify_uid === spotify_uid) {
                return user
            }
        })
        return undefined
    }

    all() {
        return Object.keys(this.users);
    }
}

const SocketClients = new SocketClientManager();

export default SocketClients;