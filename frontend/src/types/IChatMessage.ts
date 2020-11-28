
export default interface IChatMessage {
    type: "msg" | "session",
    name?: string,
    msg: string
}