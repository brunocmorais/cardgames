import { FreeCell } from "../FreeCell";
import { DefaultFoundation } from "../Default/DefaultFoundation";

export class DoubleTraditionalFreeCell extends FreeCell {

    constructor(gameNumber : number) {
        
        const sizes = { 
            decks: 2, 
            columns: 10, 
            cells: 8, 
            foundations: 8
        };

        const foundation = new DefaultFoundation(sizes.foundations);

        super(gameNumber, sizes, foundation);
    }
}