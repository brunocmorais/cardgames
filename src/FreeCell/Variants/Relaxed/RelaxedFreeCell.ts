import { Card } from "../../../Common/Model/Card";
import { Column } from "../../../Common/Model/Column";
import { FreeCellOptions } from "../../FreeCellOptions";
import { FreeCell } from "../../FreeCell";
import { DefaultFoundation } from "../Default/DefaultFoundation";

export class RelaxedFreeCell extends FreeCell {

    constructor(gameNumber : number) {

        const params : FreeCellOptions = { 
            decks: 1, 
            columns: 8, 
            cells: 4, 
            foundations: 4
        };

        const foundation = new DefaultFoundation(params.foundations);

        super(gameNumber, params, foundation);
    }
    
    protected numberOfCardsIsValid(_card: Card, _currentColumn: Column, 
        _destinationColumn?: Column | undefined) {
        return true;
    }
}