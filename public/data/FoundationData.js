import { CellData } from "./CellData.js";
import { gameWidth } from "../Constants.js";
export class FoundationData {
    foundationData = [];
    image;
    constructor(canvasWidth, image) {
        this.image = image;
        this.update(canvasWidth);
    }
    toArray = () => [...this.foundationData];
    get(index) {
        return this.foundationData[index];
    }
    update(canvasWidth) {
        this.foundationData = [];
        for (let i = 0; i < 4; i++) {
            this.foundationData.push(new CellData(85 * (i + 4) + (Math.floor(canvasWidth / 2) - Math.floor(gameWidth / 2)), 20, i, this.image));
        }
    }
}
