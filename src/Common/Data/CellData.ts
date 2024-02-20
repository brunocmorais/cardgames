export class CellData {
    
    public x;
    public y;
    public readonly index;
    public readonly image;

    constructor(x : number, y : number, index : number, image: HTMLImageElement | undefined) {
        this.x = x;
        this.y = y;
        this.index = index;
        this.image = image;
    }

    public definePosition(x : number, y : number) {
        this.x = x;
        this.y = y;
    }
}