import { FreeCell } from "../FreeCell";
import { CardsData } from "./CardsData";
import { ColumnsData } from "../../Common/Data/ColumnsData";
import { FoundationData } from "./FoundationData";
import { CellsData } from "./CellsData";
import { IGameData } from "../../Common/Data/IGameData";

export class FreeCellGameData implements IGameData {

    public readonly freeCells : CellsData;
    public readonly foundation : FoundationData;
    public readonly columns : ColumnsData;
    public readonly cards : CardsData;
    private readonly freeCell : FreeCell;

    constructor(freeCell: FreeCell) {

        this.freeCell = freeCell;
        this.freeCells = new CellsData(0, freeCell.cells.length, freeCell.foundation.length);
        this.foundation = new FoundationData(0, freeCell.foundation.length, freeCell.cells.length);
        this.columns = new ColumnsData(0, freeCell.tableau.length);
        this.cards = new CardsData(0, freeCell);
    }

    public update(canvasWidth : number) {
        this.freeCells.update(canvasWidth, this.freeCell.cells.length, this.freeCell.foundation.length);
        this.foundation.update(canvasWidth, this.freeCell.foundation.length, this.freeCell.cells.length);
        this.columns.update(canvasWidth, this.freeCell.tableau.length);
        this.cards.update(canvasWidth);
    }
}