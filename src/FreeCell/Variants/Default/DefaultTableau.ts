import { Card } from "../../../Common/Model/Card";
import { Column } from "../../../Common/Model/Column";
import { Tableau } from "../../../Common/Model/Tableau";
import { range } from "../../../Util/Functions";

export class DefaultTableau extends Tableau {

    constructor(cards : Card[], columnCount : number) {
        super(columnCount);
        this.fillColumns(cards);
    }

    fillColumns(cards : Card[]) {
        let columnIndex = 0;
    
        for (const card of cards) {
    
            this.columns[columnIndex].add(card);
            columnIndex = (columnIndex + 1) % this.length;
        }
    }
}