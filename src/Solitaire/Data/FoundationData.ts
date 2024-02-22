import { CellData } from "../../Common/Data/CellData";
import { cardWidthPadding } from "../../Common/Model/Constants";

export class FoundationData {

    private foundationData : CellData[] = [];
    public readonly image: HTMLImageElement;

    constructor(canvasWidth : number, foundationCount : number) {
        this.image = new Image();
        this.image.src = "images/empty.png";
        this.update(canvasWidth, foundationCount);
    }

    filter (fn: (x: CellData) => boolean) {
        return this.foundationData.filter(fn);
    }

    get (index : number) {
        return this.foundationData[index];
    }

    public update(canvasWidth : number, foundationCount : number) {

        const cellsWidth = cardWidthPadding * (foundationCount);

        for (let i = 0; i < foundationCount; i++) {
            const x = (cardWidthPadding * (i + 1.5)) + (Math.floor(canvasWidth / 2) - Math.floor(cellsWidth / 2));
            const y = 20;

            if (!this.foundationData[i])
                this.foundationData.push(new CellData(x, 20, i, this.image));
            else
                this.foundationData[i].definePosition(x, y);
        }
    }
}
