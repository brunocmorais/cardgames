import { Card } from "../Model/Card";
import { cardSize } from "../Model/Constants";
import { Coordinate } from "../Model/Coordinate";

export class CardData {

    public x : number;
    public y : number;
    public z : number;
    public isDragging : boolean; 
    public card : Card;

    constructor(x : number, y : number, z : number, isDragging : boolean, card : Card) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.isDragging = isDragging;
        this.card = card;
    }

    public setCardPosition(x : number, y : number, z : number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    isCardAboveObject(objectData : Coordinate) {
        return !(this.x > objectData.x + cardSize.width ||
            objectData.x > this.x + cardSize.width ||
            this.y > objectData.y + cardSize.height ||
            objectData.y > this.y + cardSize.height);
    }

    isInsideCard(coordinate : Coordinate) {
        return coordinate.x > this.x && coordinate.x < this.x + cardSize.width &&
            coordinate.y > this.y && coordinate.y < this.y + cardSize.height;
    }
}