import { blackSuits, redSuits } from "./Constants.js";

export class Card {

    public value;
    public suit;
    public number;

    constructor(value : string, suit : string, number : string) {
        this.value = value;
        this.suit = suit;
        this.number = number;
    }

    get isRed() { return redSuits.indexOf(this.suit) >= 0; }

    get isBlack() { return blackSuits.indexOf(this.suit) >= 0; }
}