import { ColumnsData } from "../../Common/Data/ColumnsData";
import { IGameData } from "../../Common/Data/IGameData";
import { Solitaire } from "../Solitaire";
import { CardsData } from "./CardsData";
import { FoundationData } from "./FoundationData";

export class SolitaireGameData implements IGameData {

    public readonly foundation : FoundationData;
    public readonly columns : ColumnsData;
    public readonly cards : CardsData;
    private readonly solitaire : Solitaire;

    constructor(solitaire: Solitaire) {

        this.solitaire = solitaire;
        this.foundation = new FoundationData(0, solitaire.foundation.length);
        this.columns = new ColumnsData(0, solitaire.tableau.length);
        this.cards = new CardsData(0, solitaire);
    }

    public update(canvasWidth : number) {
        this.foundation.update(canvasWidth, this.solitaire.foundation.length);
        this.columns.update(canvasWidth, this.solitaire.tableau.length);
        this.cards.update(canvasWidth);
    }
}