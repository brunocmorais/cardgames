import { Card } from "./Card.js";
import { Column } from "./Column.js";
import { range } from "./Util.js";

export class Tableau {

    private columns : Column[] = range(8).map(_ => new Column());

    constructor(cards : Card[]) {
        this.createColumns(cards);
    }

    createColumns(cards : Card[]) {
        let columnIndex = 0;
    
        for (const card of cards) {
    
            this.columns[columnIndex].add(card);
            columnIndex = (columnIndex + 1) % 8;
        }
    }

    getColumn(index : number) {
        return this.columns[index];
    }

    getCardColumn(card : Card) {
        for (let column = 0; column < 8; column++)
            if (this.columns[column].indexOf(card) >= 0)
                return this.columns[column];
    
        return undefined;
    }

    indexOfCard(card : Card) {
        for (let column = 0; column < 8; column++)
            if (this.columns[column].indexOf(card) >= 0)
                return column;
    
        return -1;
    }

    indexOf(column : Column) {
        return this.columns.indexOf(column);
    }

    getEmptyColumnCount() {
        return this.columns.filter(x => x.length === 0).length;
    }
}