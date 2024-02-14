import { blackSuits, redSuits } from "./Constants.js";
export class Card {
    value;
    suit;
    number;
    constructor(value, suit, number) {
        this.value = value;
        this.suit = suit;
        this.number = number;
    }
    get isRed() { return redSuits.indexOf(this.suit) >= 0; }
    get isBlack() { return blackSuits.indexOf(this.suit) >= 0; }
}
