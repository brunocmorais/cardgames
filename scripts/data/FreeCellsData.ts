import { CellData } from "./CellData.js";
import { gameWidth } from "../Constants.js";

export class FreeCellsData {

    private freeCellsData : CellData[] = [];
    public readonly image : HTMLImageElement;

    constructor(canvasWidth : number, image : HTMLImageElement) {
        this.image = image;
        this.update(canvasWidth);
    }

    toArray = () => [...this.freeCellsData];

    get (index : number) {
        return this.freeCellsData[index];
    }

    public update(canvasWidth : number) {
        this.freeCellsData = [];

        for (let i = 0; i < 4; i++) {
            this.freeCellsData.push(
                new CellData(85 * i + (Math.floor(canvasWidth / 2) - Math.floor(gameWidth / 2)) - 35, 20, i, this.image)
            );
        }
    }
}