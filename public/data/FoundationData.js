import { CellData } from "./CellData.js";
import { cardWidthPadding } from "../Constants.js";
export class FoundationData {
    foundationData = [];
    image;
    constructor(canvasWidth, foundationCount, freeCellCount) {
        this.image = new Image();
        this.image.src = "images/empty.png";
        this.update(canvasWidth, foundationCount, freeCellCount);
    }
    filter(fn) {
        return this.foundationData.filter(fn);
    }
    get(index) {
        return this.foundationData[index];
    }
    update(canvasWidth, foundationCount, freeCellCount) {
        this.foundationData = [];
        const cellsWidth = cardWidthPadding * (foundationCount + freeCellCount);
        for (let i = 0; i < foundationCount; i++) {
            this.foundationData.push(new CellData(cardWidthPadding * (i + freeCellCount) + (Math.floor(canvasWidth / 2) - Math.floor(cellsWidth / 2)), 20, i, this.image));
        }
    }
}
