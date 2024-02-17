export function sleep(millis : number) {
    return new Promise(r => setTimeout(r, millis));
}

export function range(size : number) {
    return [...Array(size).keys()];
}