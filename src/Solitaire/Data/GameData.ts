import { Solitaire } from "../Solitaire";
import { CardsData } from "./CardsData";
import { ColumnsData } from "./ColumnsData";
import { FoundationData } from "./FoundationData";

export class GameData {

    public readonly foundation : FoundationData;
    public readonly columns : ColumnsData;
    public readonly cards : CardsData;
    private readonly solitaire : Solitaire;

    constructor(canvasWidth : number, solitaire: Solitaire) {

        this.solitaire = solitaire;
        this.foundation = new FoundationData(canvasWidth, solitaire.foundation.length);
        this.columns = new ColumnsData(canvasWidth, solitaire.tableau.length);
        this.cards = new CardsData(canvasWidth, solitaire);
    }

    public update(canvasWidth : number) {
        this.foundation.update(canvasWidth, this.solitaire.foundation.length);
        this.columns.update(canvasWidth, this.solitaire.tableau.length);
        this.cards.update(canvasWidth);
    }
}