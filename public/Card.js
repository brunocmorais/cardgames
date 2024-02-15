export class Card {
    value;
    suit;
    number;
    constructor(value, suit, number) {
        this.value = value;
        this.suit = suit;
        this.number = number;
    }
    get isRed() { return ['D', 'H'].indexOf(this.suit) >= 0; }
    get isBlack() { return ['C', 'S'].indexOf(this.suit) >= 0; }
}
