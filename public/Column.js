import { Position } from "./Position.js";
export class Column {
    cards = [];
    getCard(index) {
        return this.cards[index];
    }
    add(card) {
        this.cards.push(card);
    }
    remove() {
        this.cards.pop();
    }
    indexOf(card) {
        return this.cards.indexOf(card);
    }
    get length() {
        return this.cards.length;
    }
    getCardsBelow(card) {
        const index = this.indexOf(card);
        const cards = [];
        for (let i = index + 1; i < this.length; i++)
            cards.push(this.getCard(i));
        return cards;
    }
    attemptToMoveDeepCard(card, origin) {
        if (origin === Position.columnWithCard || origin === Position.columnWithoutCard) {
            if (this.indexOf(card) != this.length - 1)
                return true;
        }
        return false;
    }
}
