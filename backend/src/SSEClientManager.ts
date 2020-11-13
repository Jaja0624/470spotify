
class SSEClientManager {
    connectedClientIds: any;

    constructor() {
        this.connectedClientIds = {};
    }

    addClient(clientId: string, response: Express.Response) {
        this.connectedClientIds[clientId] = response;
    }

    deleteClient(clientId: string) {
        delete this.connectedClientIds[clientId];
    }
    
    // clientIds: list of clients to send message to
    sendMessage(clientIds: [string], msg: Object|string, eventListener: string) {
        for (let i = 0; i < clientIds.length; i++) {
            this.connectedClientIds[clientIds[i]].res.write(`event: ${eventListener}\n`);
            this.connectedClientIds[clientIds[i]].res.write(`data: ${JSON.stringify(msg)}`);
            this.connectedClientIds[clientIds[i]].res.write("\n\n");
        }
    }

    allClientIds() {
        return Object.keys(this.connectedClientIds);
    }
}

const SSEManagerInstance = new SSEClientManager();

export default SSEManagerInstance;