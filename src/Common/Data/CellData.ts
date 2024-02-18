export class CellData {
    
    public x;
    public y;
    public index;
    public image;

    constructor(x : number, y : number, index : number, image: HTMLImageElement | undefined) {
        this.x = x;
        this.y = y;
        this.index = index;
        this.image = image;
    }
}