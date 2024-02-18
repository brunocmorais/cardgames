import { Card } from "../Common/Model/Card";
import { Tableau } from "../Common/Model/Tableau";


export class DefaultTableau extends Tableau {
    
    constructor(cards: Card[], columnCount: number) {
        super(columnCount);
        this.fillColumns(cards);
    }
    
    fillColumns(cards: Card[]) {
        
        let cardsInColumn = 1;

        for (const column of this.getColumns()) {    
            for (let i = 0; i < cardsInColumn; i++) {
                const card = cards.pop() as Card;
                card.flipped = !(i == cardsInColumn - 1);
                column.add(card);
            }
            
            cardsInColumn++;
        }
    }
}
