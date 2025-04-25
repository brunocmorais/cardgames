import { CardData } from "./CardData";
import { Card } from "../Model/Card";

export abstract class BaseCardsData {

    protected readonly cardsData : CardData[] = [];
    protected canvasWidth : number;
    public static readonly image : HTMLImageElement = new Image();
    public static color : string = "deck-red";

    constructor(canvasWidth : number) {

        this.canvasWidth = canvasWidth;
        BaseCardsData.image.src = "images/cards.png";
    }

    public abstract update(canvasWidth : number | undefined) : void;

    protected createCardData(card : Card, x : number, y : number, z : number) {
        return new CardData(x, y, z, false, card);
    }

    public setCardBack(deck : string) {
        BaseCardsData.color = deck;
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