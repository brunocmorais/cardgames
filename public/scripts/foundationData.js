import { CellData } from "./cellData.js";
import { gameWidth } from "./constants.js";


export class FoundationData {

    #foundationData = [];

    constructor(canvasWidth) {
        for (let i = 0; i < 4; i++)
            this.#foundationData.push(
                new CellData(85 * (i + 4) + (Math.floor(canvasWidth / 2) - Math.floor(gameWidth / 2)), 20, i)
            );
    }

    toArray = () => [...this.#foundationData];
}
