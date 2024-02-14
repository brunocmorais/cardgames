import { CellData } from "./CellData.js";
import { gameWidth } from "../Constants.js";


export class FoundationData {

    private foundationData : CellData[] = [];
    public readonly image: HTMLImageElement;

    constructor(canvasWidth : number, image : HTMLImageElement) {
        this.image = image;
        this.update(canvasWidth);
    }

    toArray = () => [...this.foundationData];

    get (index : number) {
        return this.foundationData[index];
    }

    public update(canvasWidth : number) {
        this.foundationData = [];

        for (let i = 0; i < 4; i++) {
            this.foundationData.push(
                new CellData(85 * (i + 4) + (Math.floor(canvasWidth / 2) - Math.floor(gameWidth / 2)), 20, i, this.image)
            );
        }
    }
}
