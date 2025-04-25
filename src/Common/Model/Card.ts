import { Coordinate } from "./Coordinate";

const valueOrder = [ '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A' ];
const suitOrder = [ 'C', 'D', 'H', 'S' ];

export class Card {

    public value;
    public suit;
    public number;
    public flipped = false;

    constructor(value : string, suit : string, number : string) {
        this.value = value;
        this.suit = suit;
        this.number = number;
    }

    get isRed() { return ['D', 'H'].indexOf(this.suit) >= 0; }

    get isBlack() { return ['C', 'S'].indexOf(this.suit) >= 0; }

    get imageCoordinate() {
        const index = (valueOrder.indexOf(this.number) * 4) + suitOrder.indexOf(this.suit);
        return new Coordinate((index % 8), (Math.floor(index / 8)));
    }
}