export class Stack<T> {

    private readonly items : T[];

    constructor(items : T[] | undefined = undefined) {
        if (items)
            this.items = [...items];
        else
            this.items = [];
    }

    public pop() {
        return this.items.pop();
    }
    
    public push(item : T) {
        this.items.push(item);
    }

    public get(index : number) {
        return this.items[index];
    }

    public indexOf(item : T) {
        return this.items.indexOf(item);
    }

    public get top() {
        return this.items[this.length - 1];
    }

    public get length() {
        return this.items.length;
    }
}
