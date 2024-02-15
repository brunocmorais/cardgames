import { Column } from "./Column.js";
import { range } from "./Util.js";
export class Tableau {
    columns;
    constructor(cards, columnCount) {
        this.columns = range(columnCount).map(_ => new Column());
        this.createColumns(cards);
    }
    createColumns(cards) {
        let columnIndex = 0;
        for (const card of cards) {
            this.columns[columnIndex].add(card);
            columnIndex = (columnIndex + 1) % this.length;
        }
    }
    getColumn(index) {
        return this.columns[index];
    }
    getCardColumn(card) {
        for (let column = 0; column < this.length; column++)
            if (this.columns[column].indexOf(card) >= 0)
                return this.columns[column];
        return undefined;
    }
    indexOfCard(card) {
        for (let column = 0; column < this.length; column++)
            if (this.columns[column].indexOf(card) >= 0)
                return column;
        return -1;
    }
    indexOf(column) {
        return this.columns.indexOf(column);
    }
    getEmptyColumnCount() {
        return this.columns.filter(x => x.length === 0).length;
    }
    get length() {
        return this.columns.length;
    }
}
