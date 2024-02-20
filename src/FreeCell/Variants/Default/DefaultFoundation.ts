import { Card } from "../../../Common/Model/Card";
import { cardNumbers } from "../../../Common/Model/Constants";
import { Foundation } from "../../../Common/Model/Foundation";

export class DefaultFoundation extends Foundation {

    validate(foundation : Card[], card : Card) {
        
        if (foundation.length === 0)
            return card.number === 'A';
            
        const topCard = foundation[foundation.length - 1];
        return card.suit == topCard.suit && (cardNumbers.indexOf(card.number) - cardNumbers.indexOf(topCard.number)) == 1;
    }
}
