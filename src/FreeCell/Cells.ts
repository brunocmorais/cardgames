import { Card } from "../Common/Model/Card";
import { range } from "../Util/Functions";

export class Cells {

    private freeCells : (Card | null)[];

    constructor(cellCount : number) {
        this.freeCells = range(cellCount).map(_ => null);
    }

    get(index : number) {
        return this.freeCells[index];
    }

    set(index : number, card : Card | null) {
        if (!this.validate(this.freeCells[index], card))
            return false;

        this.freeCells[index] = card;
        return true;
    }

    indexOf(card : Card) {
        return this.freeCells.indexOf(card);
    }

    validate(freeCell : Card | null, card : Card | null) {
        return (freeCell !== null && card === null) || (freeCell === null && card !== null);
    }

    getEmptyCellCount() {
        return this.freeCells.filter(x => x === null).length;
    }
    
    get length () {
        return this.freeCells.length;
    }
}

