import { CellData } from "./CellData.js";
import { cardVerticalDistance, cardWidthPadding } from "../Constants.js";
export class ColumnsData {
    columnsData = [];
    constructor(canvasWidth, columnCount) {
        this.update(canvasWidth, columnCount);
    }
    filter(fn) {
        return this.columnsData.filter(fn);
    }
    update(canvasWidth, columnCount) {
        this.columnsData = [];
        const tableauWidth = cardWidthPadding * columnCount;
        for (let i = 0; i < columnCount; i++) {
            const x = cardWidthPadding * (i % columnCount) + (Math.floor(canvasWidth / 2) - Math.floor(tableauWidth / 2));
            const y = cardVerticalDistance * Math.floor(i / columnCount) + 140;
            this.columnsData.push(new CellData(x, y, i, undefined));
        }
    }
}
