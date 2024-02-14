export function sleep(millis) {
    return new Promise(r => setTimeout(r, millis));
}
export function range(size) {
    return [...Array(size).keys()];
}
