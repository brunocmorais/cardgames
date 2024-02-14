export class CellData {
    
    public x : number;
    public y : number;
    public index : number;
    public image : HTMLImageElement | undefined;

    constructor(x : number, y : number, index : number, image: HTMLImageElement | undefined) {
        this.x = x;
        this.y = y;
        this.index = index;
        this.image = image;
    }
}