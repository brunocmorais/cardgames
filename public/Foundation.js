import { cardNumbers } from "./Constants.js";
import { range } from "./Util.js";
export class Foundation {
    foundation;
    loop;
    constructor(foundationCount, loop) {
        this.foundation = range(foundationCount).map(_ => []);
        this.loop = loop;
    }
    get(index) {
        return this.foundation[index];
    }
    push(index, card) {
        if (!this.validate(this.foundation[index], card))
            return false;
        this.foundation[index].push(card);
        return true;
    }
    indexOf(card) {
        for (const [index, foundation] of this.foundation.entries())
            if (foundation.indexOf(card) >= 0)
                return index;
        return -1;
    }
    validate(foundation, card) {
        const conditionToAcceptAce = this.loop ?
            foundation.length % cardNumbers.length === 0 :
            foundation.length === 0;
        if (conditionToAcceptAce)
            return card.number === 'A';
        const topCard = foundation[foundation.length - 1];
        return card.suit == topCard.suit && (cardNumbers.indexOf(card.number) - cardNumbers.indexOf(topCard.number)) == 1;
    }
    get length() {
        return this.foundation.length;
    }
}
