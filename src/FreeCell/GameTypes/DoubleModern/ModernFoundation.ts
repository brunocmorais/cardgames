import { Card } from "../../../Common/Model/Card";
import { Foundation } from "../../../Common/Model/Foundation";
import { cardNumbers } from "../../../Common/Model/Constants";

export class ModernFoundation extends Foundation {
    validate(foundation: Card[], card: Card): boolean {
        
        let canAcceptAce;

        if (foundation.length > 0) 
            canAcceptAce = this.foundation.length === cardNumbers.length;
        else {
            canAcceptAce = true;

            for (const other of this.foundation.filter(f => f !== foundation)) {
                if (other.filter(c => c.value === card.value).length > 0) {
                    canAcceptAce = false;
                    break;
                }
            }
        }
        
        if (canAcceptAce)
            return card.number === 'A';
            
        const topCard = foundation[foundation.length - 1];
        return card.suit == topCard.suit && (cardNumbers.indexOf(card.number) - cardNumbers.indexOf(topCard.number)) == 1;
    }
}