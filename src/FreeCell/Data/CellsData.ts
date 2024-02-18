import { CellData } from "../../Common/Data/CellData";
import { cardWidthPadding } from "../../Common/Model/Constants";

export class CellsData {

    private freeCellsData : CellData[] = [];
    public readonly image : HTMLImageElement;

    constructor(canvasWidth : number, freeCellsCount : number, foundationCount : number) {
        this.image = new Image();
        this.image.src = "images/empty.png";
        this.update(canvasWidth, freeCellsCount, foundationCount);
    }

    get (index : number)  {
        return this.freeCellsData[index];
    }

    public filter(fn : (x: CellData) => boolean) {
        return this.freeCellsData.filter(fn);
    }

    public update(canvasWidth : number, freeCellsCount : number, foundationCount : number) {
        this.freeCellsData = [];
        const cellsWidth = cardWidthPadding * (freeCellsCount + foundationCount);

        for (let i = 0; i < freeCellsCount; i++) {
            this.freeCellsData.push(
                new CellData(cardWidthPadding * i + (Math.floor(canvasWidth / 2) - Math.floor(cellsWidth / 2)), 20, i, this.image)
            );
        }
    }
}