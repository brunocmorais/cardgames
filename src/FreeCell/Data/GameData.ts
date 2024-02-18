import { FreeCell } from "../GameTypes/FreeCell";
import { CardsData } from "./CardsData";
import { ColumnsData } from "./ColumnsData";
import { FoundationData } from "./FoundationData";
import { CellsData } from "./CellsData";

export class GameData {

    public readonly freeCells : CellsData;
    public readonly foundation : FoundationData;
    public readonly columns : ColumnsData;
    public readonly cards : CardsData;
    private readonly freeCell : FreeCell;

    constructor(canvasWidth : number, freeCell: FreeCell) {

        this.freeCell = freeCell;
        this.freeCells = new CellsData(canvasWidth, freeCell.cells.length, freeCell.foundation.length);
        this.foundation = new FoundationData(canvasWidth, freeCell.foundation.length, freeCell.cells.length);
        this.columns = new ColumnsData(canvasWidth, freeCell.tableau.length);
        this.cards = new CardsData(canvasWidth, freeCell);
    }

    public update(canvasWidth : number) {
        this.freeCells.update(canvasWidth, this.freeCell.cells.length, this.freeCell.foundation.length);
        this.foundation.update(canvasWidth, this.freeCell.foundation.length, this.freeCell.cells.length);
        this.columns.update(canvasWidth, this.freeCell.tableau.length);
        this.cards.update(canvasWidth);
    }
}