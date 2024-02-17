import { Card } from "./Card";
import { Column } from "./Column";
import { range } from "./Util";

export class Tableau {

    private columns : Column[];

    constructor(cards : Card[], columnCount : number) {
        this.columns = range(columnCount).map(_ => new Column());
        this.createColumns(cards);
    }

    createColumns(cards : Card[]) {
        let columnIndex = 0;
    
        for (const card of cards) {
    
            this.columns[columnIndex].add(card);
            columnIndex = (columnIndex + 1) % this.length;
        }
    }

    getColumn(index : number) {
        return this.columns[index];
    }

    getCardColumn(card : Card) {
        for (let column = 0; column < this.length; column++)
            if (this.columns[column].indexOf(card) >= 0)
                return this.columns[column];
    
        return undefined;
    }

    indexOfCard(card : Card) {
        for (let column = 0; column < this.length; column++)
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

    get length() {
        return this.columns.length;
    }
}