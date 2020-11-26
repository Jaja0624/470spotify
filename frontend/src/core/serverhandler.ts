import { getUserGroups, getActive } from './server'
import IGroup from '../types/IGroup'

// For parsing and manipulating response data
export const getGroupsHandler = async (userId: string): Promise<IGroup[]> => {
    const res = await getUserGroups(userId);
    console.log("group data response", res.data); // here is the group data
    const groups: Array<IGroup> = [];
    
    if (res.data.length === 0) {
        return groups;
    }

    for (let i = 0; i < res.data.length; i++) {
        let newG: IGroup = {
            id: res.data[i].group_uid,
            name: res.data[i].group_name,
            img_url: undefined
        }
        const active = await getActive(res.data[i].group_uid, userId);
        if (active) {
            // console.log(active.data[0]);
            newG.active = active.data
        }
        groups.push(newG);
    }
    console.log("all group data", groups); // here is the group data
    return groups;
}