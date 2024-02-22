import { cardSize } from "../Model/Constants";
import { Coordinate } from "../Model/Coordinate";

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

    public isInsideCell(coordinate : Coordinate) {
        return coordinate.x > this.x && coordinate.x < this.x + cardSize.width &&
            coordinate.y > this.y && coordinate.y < this.y + cardSize.height;
    }
}