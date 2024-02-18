import { CellData } from "../../Common/Data/CellData";
import { cardWidthPadding } from "../../Common/Model/Constants";

export class FoundationData {

    private foundationData : CellData[] = [];
    public readonly image: HTMLImageElement;

    constructor(canvasWidth : number, foundationCount : number, freeCellCount : number) {
        this.image = new Image();
        this.image.src = "images/empty.png";
        this.update(canvasWidth, foundationCount, freeCellCount);
    }

    filter (fn: (x: CellData) => boolean) {
        return this.foundationData.filter(fn);
    }

    get (index : number) {
        return this.foundationData[index];
    }

    public update(canvasWidth : number, foundationCount : number, freeCellCount : number) {
        this.foundationData = [];
        const cellsWidth = cardWidthPadding * (foundationCount + freeCellCount);

        for (let i = 0; i < foundationCount; i++) {
            this.foundationData.push(
                new CellData(cardWidthPadding * (i + freeCellCount) + (Math.floor(canvasWidth / 2) - Math.floor(cellsWidth / 2)), 20, i, this.image)
            );
        }
    }
}
