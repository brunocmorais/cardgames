import { Card } from "./Card";
import { Column } from "./Column";
import { range } from "../../Util/Functions";

export abstract class Tableau {

    protected columns : Column[];

    constructor(columnCount : number) {
        this.columns = range(columnCount).map(_ => new Column());
    }

    abstract fillColumns(cards : Card[]) : void;

    getColumn(index : number) {
        return this.columns[index];
    }

    getColumns() {
        return [...this.columns];
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