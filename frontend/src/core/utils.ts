export const extractUris = (trackData: any[]) => {
    if (!trackData) {
        return [];
    }
    let uris = []
    for (let i = 0; i < trackData.length; i++) {
        uris.push(trackData[i].track.uri)
    }
    return uris;
}

