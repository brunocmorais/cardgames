import { range } from "./Util.js";
export class FreeCells {
    freeCells;
    constructor(cellCount) {
        this.freeCells = range(cellCount).map(_ => null);
    }
    get(index) {
        return this.freeCells[index];
    }
    set(index, card) {
        if (!this.validate(this.freeCells[index], card))
            return false;
        this.freeCells[index] = card;
        return true;
    }
    indexOf(card) {
        return this.freeCells.indexOf(card);
    }
    validate(freeCell, card) {
        return (freeCell !== null && card === null) || (freeCell === null && card !== null);
    }
    getEmptyCellCount() {
        return this.freeCells.filter(x => x === null).length;
    }
    get length() {
        return this.freeCells.length;
    }
}
