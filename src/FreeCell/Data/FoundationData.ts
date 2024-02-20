import { CellData } from "../../Common/Data/CellData";
import { cardWidthPadding } from "../../Common/Model/Constants";

export class FoundationData {

    private readonly foundationData : CellData[] = [];
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

        const cellsWidth = cardWidthPadding * (foundationCount + freeCellCount);

        for (let i = 0; i < foundationCount; i++) {
            const data = this.foundationData[i];
            const x = cardWidthPadding * (i + freeCellCount) + (Math.floor(canvasWidth / 2) - Math.floor(cellsWidth / 2));
            const y = 20;

            if (!data)
                this.foundationData.push(new CellData(x, y, i, this.image));
            else
                data.definePosition(x, y);
        }
    }
}
