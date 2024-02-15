import { CellData } from "./CellData.js";
import { cardWidthPadding } from "../Constants.js";
export class FreeCellsData {
    freeCellsData = [];
    image;
    constructor(canvasWidth, freeCellsCount, foundationCount) {
        this.image = new Image();
        this.image.src = "images/empty.png";
        this.update(canvasWidth, freeCellsCount, foundationCount);
    }
    get(index) {
        return this.freeCellsData[index];
    }
    filter(fn) {
        return this.freeCellsData.filter(fn);
    }
    update(canvasWidth, freeCellsCount, foundationCount) {
        this.freeCellsData = [];
        const cellsWidth = cardWidthPadding * (freeCellsCount + foundationCount);
        for (let i = 0; i < freeCellsCount; i++) {
            this.freeCellsData.push(new CellData(cardWidthPadding * i + (Math.floor(canvasWidth / 2) - Math.floor(cellsWidth / 2)), 20, i, this.image));
        }
    }
}
