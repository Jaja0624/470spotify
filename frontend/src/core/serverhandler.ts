import { getUserGroups } from './server'
import IGroup from '../types/IGroup'

// For parsing and manipulating response data

export const getGroupsHandler = async (userId: string): Promise<IGroup[]> => {
    const res = await getUserGroups(userId);
    console.log("group dataaaaaaaaaaaaaaaaaa", res.data); // here is the group data
    const groups: Array<IGroup> = [];
    
    if (res.data.length === 0) {
        return groups;
    }

    for (let i = 0; i < res.data.length; i++) {
        let newG = {
            id: res.data[i].group_uid,
            name: res.data[i].group_name,
            img_url: undefined
        }
        groups.push(newG);
    }
    return groups;
}