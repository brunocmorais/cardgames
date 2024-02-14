import { CardData } from "./CardData.js";
import { cardDistance, gameWidth } from "../Constants.js";
import { FreeCell } from "../FreeCell.js";
import { Card } from "../Card.js";

export class CardsData {

    private cardsInfo : CardData[] = [];
    private freeCell : FreeCell; 
    private canvasWidth : number;

    constructor(canvasWidth : number, freeCell : FreeCell) {

        this.canvasWidth = canvasWidth;
        this.freeCell = freeCell;

        this.update();
    }

    public update(canvasWidth : number | undefined = undefined) {

        if (canvasWidth)
            this.canvasWidth = canvasWidth;

        this.cardsInfo = [];

        for (let i = 0; i < 4; i++) { // free cells
            const cell = this.freeCell.freeCells.get(i);

            if (cell) {
                const x = 85 * i + (Math.floor(this.canvasWidth / 2) - Math.floor(gameWidth / 2)) - 35;
                this.cardsInfo.push(this.createCardInfo(cell, x, 20, 1));
            }
        }

        for (let i = 0; i < 4; i++) { // foundation
            const foundation = this.freeCell.foundations.get(i);

            if (foundation) {
                const x = 85 * (i + 4) + (Math.floor(this.canvasWidth / 2) - Math.floor(gameWidth / 2));
                let z = 1;

                for (const card of foundation)
                    this.cardsInfo.push(this.createCardInfo(card, x, 20, z++));
            }
        }

        for (let i = 0; i < 8; i++) { // tableau
            const column = this.freeCell.tableau.getColumn(i);

            const x = 80 * (i % 8) + (Math.floor(this.canvasWidth / 2) - Math.floor(gameWidth / 2));

            for (let j = 0; j < column.length; j++) {
                const card = column.getCard(j);
                const y = cardDistance * j + 140;
                const z = j + 1;
                this.cardsInfo.push(this.createCardInfo(card, x, y, z));
            }
        }
    }

    private createCardInfo(card : Card, x : number, y : number, z : number) {
        const image = new Image();
        image.src = `cards/${card.value}.png`;

        return new CardData(x, y, z, false, image, card)
    }

    toArray = () => [...this.cardsInfo];

    getDraggingCard() {
        return this.getDraggingCards()[0];
    }

    getDraggingCards() {
        return this.cardsInfo.filter(x => x.isDragging).sort((a, b) => a.z - b.z);
    }

    get(card : Card) {
        return this.cardsInfo.filter(x => x.card == card)[0];
    }
}