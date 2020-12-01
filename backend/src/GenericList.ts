
class GenericList {

    list: string[];

    constructor() {
        this.list = [];
    }

    add(item: string) {
        this.list.push(item);
    }

    delete(target: string) {
        this.list = this.list.filter(item => item !== target)
    }
    
    allItems() {
        return this.list
    }
}

export default GenericList;