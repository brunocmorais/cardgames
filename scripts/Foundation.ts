import { Card } from "./Card.js";
import { cardNumbers } from "./Constants.js";
import { range } from "./Util.js";

export class Foundation {
    private foundation : Card[][];
    private loop : boolean;

    constructor(foundationCount : number, loop : boolean) {
        this.foundation = range(foundationCount).map(_ => []);
        this.loop = loop;
    }

    get(index : number) {
        return this.foundation[index];
    }

    push(index : number, card : Card) {
        if (!this.validate(this.foundation[index], card))
            return false;

        this.foundation[index].push(card);
        return true;
    }

    indexOf(card : Card) {
        for (const [index, foundation] of this.foundation.entries())
            if (foundation.indexOf(card) >= 0)
                return index;

        return -1;
    }

    validate(foundation : Card[], card : Card) {
        
        let canAcceptAce;

        if (!this.loop) {
            canAcceptAce = foundation.length === 0;
        } else {
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
        }
        
        if (canAcceptAce)
            return card.number === 'A';
            
        const topCard = foundation[foundation.length - 1];
        return card.suit == topCard.suit && (cardNumbers.indexOf(card.number) - cardNumbers.indexOf(topCard.number)) == 1;
    }
    
    get length() {
        return this.foundation.length;
    }
}
