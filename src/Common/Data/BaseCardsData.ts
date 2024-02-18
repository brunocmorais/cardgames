import { CardData } from "./CardData";
import { Card } from "../Model/Card";

export abstract class BaseCardsData {

    protected cardsData : CardData[] = [];
    protected canvasWidth : number;
    public readonly cardBack : HTMLImageElement;

    constructor(canvasWidth : number) {

        this.canvasWidth = canvasWidth;
        this.cardBack = new Image();
        this.cardBack.src = "images/backr.png";
    }

    public abstract update(canvasWidth : number | undefined) : void;

    protected createCardData(card : Card, x : number, y : number, z : number) {
        const image = new Image();
        image.src = `images/${card.value}.png`;

        return new CardData(x, y, z, false, image, card)
    }

    filter(fn: (x: CardData) => boolean) {
        return this.cardsData.filter(fn);
    }

    getDraggingCards() {
        return this.cardsData.filter(x => x.isDragging).orderBy(x => x.z);
    }

    getBy(card : Card) {
        return this.cardsData.filter(x => x.card == card)[0];
    }

    get(index : number) {
        return this.cardsData[index];
    }

    get length() {
        return this.cardsData.length;
    }
}