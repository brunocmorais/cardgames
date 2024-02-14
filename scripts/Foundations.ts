import { Card } from "./Card.js";
import { cardNumbers } from "./Constants.js";
import { range } from "./Util.js";

export class Foundations {
    private foundations : Card[][] = range(4).map(_ => []);

    get(index : number) {
        return this.foundations[index];
    }

    push(index : number, card : Card) {
        if (!this.validate(this.foundations[index], card))
            return false;

        this.foundations[index].push(card);
        return true;
    }

    pop(index : number) {
        this.foundations[index].pop();
    }

    indexOf(card : Card) {
        for (const [index, foundation] of this.foundations.entries())
            if (foundation.indexOf(card) >= 0)
                return index;

        return -1;
    }

    validate(foundation : Card[], card : Card) {
        if (foundation.length === 0)
            return card.number == 'A';
            
        const topCard = foundation[foundation.length - 1];
        return card.suit == topCard.suit && (cardNumbers.indexOf(card.number) - cardNumbers.indexOf(topCard.number)) == 1;
    }
}
