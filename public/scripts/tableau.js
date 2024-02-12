import { Column } from "./column.js";
import { range } from "./util.js";

export class Tableau {

    #columns = range(8).map(_ => new Column());

    constructor(cards) {
        this.#createColumns(cards);
    }

    #createColumns(cards) {
        let columnIndex = 0;
    
        for (const card of cards) {
    
            this.#columns[columnIndex].addCard(card);
            columnIndex = (columnIndex + 1) % 8;
        }
    }

    getColumn(index) {
        return this.#columns[index];
    }

    getCardColumn(card) {
        for (let column = 0; column < 8; column++)
            if (this.#columns[column].indexOf(card) >= 0)
                return this.#columns[column];
    
        return undefined;
    }

    indexOf(card) {
        for (let column = 0; column < 8; column++)
            if (this.#columns[column].indexOf(card) >= 0)
                return column;
    
        return undefined;
    }

    getEmptyColumnCount() {
        return this.#columns.filter(x => x.size() === 0);
    }
}