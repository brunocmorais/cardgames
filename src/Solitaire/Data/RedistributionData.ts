import { CellData } from "../../Common/Data/CellData";
import { cardWidthPadding } from "../../Common/Model/Constants";

export class RedistributionData {

    public readonly stack : CellData;
    public readonly waste : CellData;

    constructor(canvasWidth : number) {
        this.stack = new CellData(0, 0, 0);
        this.waste = new CellData(0, 0, 0);
        
        this.update(canvasWidth);
    }

    public update(canvasWidth : number) {

        const calculateX = (padding : number) => (cardWidthPadding * padding) + (Math.floor((canvasWidth / 2) - cardWidthPadding));
        
        this.stack.definePosition(calculateX(-2.5), 20);
        this.waste.definePosition(calculateX(-1.5), 20);
    }
}