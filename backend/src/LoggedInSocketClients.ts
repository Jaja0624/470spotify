
interface userData {
    name?: string,
    spotify_uid: string,
    pro_pic: string // url
}

// Maps socket ids to user

// key: socket id
// value: userData
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
        for (const socketId in this.users) {
            if (this.users[socketId].spotify_uid === spotify_uid) {
                return this.users[socketId]
            }
        }
        return undefined
    }

    all() {
        return Object.keys(this.users);
    }
}

const SocketClients = new SocketClientManager();

export default SocketClients;