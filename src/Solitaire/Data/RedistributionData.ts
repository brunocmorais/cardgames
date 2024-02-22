import { CellData } from "../../Common/Data/CellData";
import { cardWidthPadding } from "../../Common/Model/Constants";
import { Solitaire } from "../Solitaire";

export class RedistributionData {

    public readonly image : HTMLImageElement;
    public readonly stack : CellData;
    public readonly waste : CellData;

    constructor(canvasWidth : number) {
        this.image = new Image();
        this.image.src = "images/empty.png";
        this.stack = new CellData(0, 0, 0, this.image);
        this.waste = new CellData(0, 0, 0, undefined);
        
        this.update(canvasWidth);
    }

    public update(canvasWidth : number) {

        const calculateX = (padding : number) => (cardWidthPadding * padding) + (Math.floor((canvasWidth / 2) - cardWidthPadding));
        
        this.stack.definePosition(calculateX(-2.5), 20);
        this.waste.definePosition(calculateX(-1.5), 20);
    }
}