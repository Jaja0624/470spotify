
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
        delete this.users[socket_id];
    }

    all() {
        return Object.keys(this.users);
    }
}

const SocketClients = new SocketClientManager();

export default SocketClients;