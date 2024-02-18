import { FreeCellParams } from "../../FreeCellParams";
import { GameType } from "../FreeCellGameType";
import { FreeCell } from "../FreeCell";
import { DefaultFoundation } from "./DefaultFoundation";

export class DefaultFreeCell extends FreeCell {

    constructor(gameNumber : number) {
        
        const params : FreeCellParams = { 
            decks: 1, 
            columns: 8, 
            cells: 4, 
            foundations: 4
        };

        const foundation = new DefaultFoundation(params.foundations);

        super(gameNumber, params, foundation);
    }
}