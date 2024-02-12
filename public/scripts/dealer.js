import { Card } from "./card.js";
import { cardNumbers, suits } from "./constants.js";

export class Dealer {

    #rngState;
    
    constructor() {
        this.#rngState = 1;
    }

    dealCards() {

        const cards = this.#getOrderedCards();
        let deal = [];

        while (cards.length > 0) {
            const index = this.#rng() % cards.length;
            const lastIndex = cards.length - 1;

            const cardA = cards[index];
            const cardB = cards[lastIndex];

            cards[index] = cardB;
            cards[lastIndex] = cardA;

            deal.push(cards.pop());
        }

        return deal;
    } 

    #rng() {
        this.#rngState = (214013 * this.#rngState + 2531011) % Math.pow(2, 31);
        return this.#rngState >> 16;
    }

    #getOrderedCards() {
        let cards = [];
        
        for (let i = 0; i < cardNumbers.length; i++)
            for (let j = 0; j < suits.length; j++)
                cards.push(new Card(cardNumbers[i] + suits[j], suits[j], cardNumbers[i]));

        return cards;
    }
}