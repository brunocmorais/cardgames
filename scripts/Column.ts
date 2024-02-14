import { Card } from "./Card.js";

export class Column {
    
    private cards : Card[] = [];

    getCard(index : number) {
        return this.cards[index];
    }

    add(card : Card) {
        this.cards.push(card);
    }

    remove() {
        this.cards.pop();
    }

    indexOf(card : Card) {
        return this.cards.indexOf(card);
    }

    get length() {
        return this.cards.length;
    }
}