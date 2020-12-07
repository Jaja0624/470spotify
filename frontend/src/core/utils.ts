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

export const copyFrom = (target: any, array: any[]) => {
    let newArr = [];
    let copy = false;
    for (let i = 0; i < array.length; i++) {    
        if (array[i] == target) {
            copy = true
        }
        if (copy) {
            newArr.push(array[i])
        }
    }
    return newArr;
}

export const remove = (target: any, array: any[]) => {
    for (let i = 0; i < array.length; i++) {    
        if (array[i] == target) {
            array.splice(array[i], 1)
        }
    }
    return array;
}