import { FreeCell } from "../FreeCell";
import { ModernFoundation } from "./ModernFoundation";


export class DoubleModernFreeCell extends FreeCell {

    constructor(gameNumber: number) {

        const sizes = {
            decks: 2,
            columns: 10,
            cells: 6,
            foundations: 4
        };

        const modernFoundation = new ModernFoundation(sizes.foundations);

        super(gameNumber, sizes, modernFoundation);
    }
}
