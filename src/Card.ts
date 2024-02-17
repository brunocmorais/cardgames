export class Card {

    public value;
    public suit;
    public number;

    constructor(value : string, suit : string, number : string) {
        this.value = value;
        this.suit = suit;
        this.number = number;
    }

    get isRed() { return ['D', 'H'].indexOf(this.suit) >= 0; }

    get isBlack() { return ['C', 'S'].indexOf(this.suit) >= 0; }
}