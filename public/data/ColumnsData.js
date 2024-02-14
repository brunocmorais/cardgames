import { CellData } from "./CellData.js";
import { gameWidth } from "../Constants.js";
export class ColumnsData {
    columnsInfo = [];
    constructor(canvasWidth) {
        this.update(canvasWidth);
    }
    toArray = () => [...this.columnsInfo];
    update(canvasWidth) {
        this.columnsInfo = [];
        for (let i = 0; i < 8; i++) {
            const x = 80 * (i % 8) + (Math.floor(canvasWidth / 2) - Math.floor(gameWidth / 2));
            const y = 18 * Math.floor(i / 8) + 140;
            this.columnsInfo.push(new CellData(x, y, i, undefined));
        }
    }
}
