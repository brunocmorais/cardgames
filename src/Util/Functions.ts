
declare global {
    interface Array<T> {
        orderBy(fn: (x: T) => number): Array<T>;
        orderByDesc(fn: (x: T) => number): Array<T>;
    }
}

export function sleep(millis : number) {
    return new Promise(r => setTimeout(r, millis));
}

export function range(size : number) {
    return [...Array(size).keys()];
}

Array.prototype.orderBy = function<T>(fn: (x: T) => number) : Array<T> {
    return this.sort((a, b) => fn(a) - fn(b));
}

Array.prototype.orderByDesc = function<T>(fn: (x: T) => number) : Array<T> {
    return this.sort((a, b) => fn(b) - fn(a));
}