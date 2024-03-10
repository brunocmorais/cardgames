import { Card } from "./Card";
import { Position } from "../../FreeCell/Position";

export class Column {
    
    private cards : Card[] = [];

    getCard(index : number) {
        return this.cards[index];
    }

    getCards() {
        return [...this.cards];
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

    public getCardsBelow(card : Card) {
        const index = this.indexOf(card);
        const cards = [];

        for (let i = index + 1; i < this.length; i++)
            cards.push(this.getCard(i));

        return cards;
    }

    public isDeepCard(card : Card) {
        const index = this.indexOf(card);
        return index >= 0 && index != this.length - 1;
    }
}