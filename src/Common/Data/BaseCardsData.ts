import { CardData } from "./CardData";
import { Card } from "../Model/Card";

export abstract class BaseCardsData {

    protected readonly cardsData : CardData[] = [];
    protected canvasWidth : number;
    public static readonly cardBack : HTMLImageElement = new Image();

    constructor(canvasWidth : number) {

        this.canvasWidth = canvasWidth;

        if (!BaseCardsData.cardBack.src)
            BaseCardsData.cardBack.src = "images/backr.png";
    }

    public abstract update(canvasWidth : number | undefined) : void;

    protected createCardData(card : Card, x : number, y : number, z : number) {
        const image = new Image();
        image.src = `images/${card.value}.png`;

        return new CardData(x, y, z, false, image, card)
    }

    public setCardBack(deck : string) {

        switch (deck) {
            case "deck-blue":
                BaseCardsData.cardBack.src = "images/backb.png";
                break;
            case "deck-red":
                BaseCardsData.cardBack.src = "images/backr.png";
                break;
        }
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