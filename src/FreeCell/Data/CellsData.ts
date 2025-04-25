import { CellData } from "../../Common/Data/CellData";
import { cardWidthPadding } from "../../Common/Model/Constants";

export class CellsData {

    private readonly freeCellsData : CellData[] = [];

    constructor(canvasWidth : number, freeCellsCount : number, foundationCount : number) {
        this.update(canvasWidth, freeCellsCount, foundationCount);
    }

    get (index : number)  {
        return this.freeCellsData[index];
    }

    public filter(fn : (x: CellData) => boolean) {
        return this.freeCellsData.filter(fn);
    }

    public update(canvasWidth : number, freeCellsCount : number, foundationCount : number) {
        
        const cellsWidth = cardWidthPadding * (freeCellsCount + foundationCount);

        for (let i = 0; i < freeCellsCount; i++) {
            const data = this.freeCellsData[i];
            const x = cardWidthPadding * i + (Math.floor(canvasWidth / 2) - Math.floor(cellsWidth / 2));
            const y = 20;

            if (!data)
                this.freeCellsData.push(new CellData(x, y, i));
            else
                data.definePosition(x, y);
        }
    }
}