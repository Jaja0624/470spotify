
class GenericList {

    list: string[];

    constructor() {
        this.list = [];
    }

    add(item: string) {
        this.list.push(item);
    }

    delete(item: string) {
        this.list = this.list.filter(item => item === item)
    }
    
    allItems() {
        return this.list
    }
}

export default GenericList;