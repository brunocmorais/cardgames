import { CellData } from "./cellData.js";
import { gameWidth } from "./constants.js";

export class FreeCellsData {

    #freeCellsData = [];

    constructor(canvasWidth) {
        for (let i = 0; i < 4; i++)
            this.#freeCellsData.push(
                new CellData(85 * i + (Math.floor(canvasWidth / 2) - Math.floor(gameWidth / 2)) - 35, 20, i)
            );
    }

    toArray = () => [...this.#freeCellsData];
}