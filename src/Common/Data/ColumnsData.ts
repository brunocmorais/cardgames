import { CellData } from "./CellData";
import { cardVerticalDistance, cardWidthPadding } from "../Model/Constants";

export class ColumnsData {

    private readonly columnsData : CellData[] = [];

    constructor(canvasWidth : number, columnCount : number) {
        this.update(canvasWidth, columnCount);
    }

    filter (fn : (x : CellData) => boolean) {
        return this.columnsData.filter(fn);
    }

    public update(canvasWidth : number, columnCount : number) {

        const tableauWidth = cardWidthPadding * columnCount;

        for (let i = 0; i < columnCount; i++) {
            const data = this.columnsData[i];
            const x = cardWidthPadding * (i % columnCount) + (Math.floor(canvasWidth / 2) - Math.floor(tableauWidth / 2));
            const y = cardVerticalDistance * Math.floor(i / columnCount) + 140;
    
            if (!data)
                this.columnsData.push(new CellData(x, y, i));
            else
                data.definePosition(x, y);
        }
    }
}