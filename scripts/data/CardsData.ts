import { CardData } from "./CardData.js";
import { cardVerticalDistance, cardWidthPadding } from "../Constants.js";
import { FreeCell } from "../FreeCell.js";
import { Card } from "../Card.js";

export class CardsData {

    private cardsData : CardData[] = [];
    private freeCell : FreeCell; 
    private canvasWidth : number;
    private tableauWidth: number;
    private cellsWidth: number;

    constructor(canvasWidth : number, freeCell : FreeCell) {

        this.canvasWidth = canvasWidth;
        this.freeCell = freeCell;
        this.tableauWidth = cardWidthPadding * freeCell.tableau.length;
        this.cellsWidth = cardWidthPadding * (freeCell.cells.length + freeCell.foundation.length);

        this.update();
    }

    public update(canvasWidth : number | undefined = undefined) {

        if (canvasWidth)
            this.canvasWidth = canvasWidth;

        this.cardsData = [];

        this.updateFreeCellsData();
        this.updateFoundationData();
        this.updateTableauData();
    }

    private updateTableauData() {
        for (let i = 0; i < this.freeCell.tableau.length; i++) {
            const column = this.freeCell.tableau.getColumn(i);

            const x = cardWidthPadding * (i % this.freeCell.tableau.length) + (Math.floor(this.canvasWidth / 2) - Math.floor(this.tableauWidth / 2));

            for (let j = 0; j < column.length; j++) {
                const card = column.getCard(j);
                const y = cardVerticalDistance * j + 140;
                const z = j + 1;
                this.cardsData.push(this.createCardData(card, x, y, z));
            }
        }
    }

    private updateFoundationData() {
        for (let i = 0; i < this.freeCell.foundation.length; i++) {
            const foundation = this.freeCell.foundation.get(i);

            if (foundation) {
                const x = cardWidthPadding * (i + this.freeCell.cells.length) + (Math.floor(this.canvasWidth / 2) - Math.floor(this.cellsWidth / 2));
                let z = 1;

                for (const card of foundation)
                    this.cardsData.push(this.createCardData(card, x, 20, z++));
            }
        }
    }

    private updateFreeCellsData() {
        for (let i = 0; i < this.freeCell.cells.length; i++) {
            const cell = this.freeCell.cells.get(i);

            if (cell) {
                const x = cardWidthPadding * i + (Math.floor(this.canvasWidth / 2) - Math.floor(this.cellsWidth / 2));
                this.cardsData.push(this.createCardData(cell, x, 20, 1));
            }
        }
    }

    private createCardData(card : Card, x : number, y : number, z : number) {
        const image = new Image();
        image.src = `images/${card.value}.png`;

        return new CardData(x, y, z, false, image, card)
    }

    filter(fn: (x: CardData) => boolean) {
        return this.cardsData.filter(fn);
    }

    getDraggingCards() {
        return this.cardsData.filter(x => x.isDragging).sort((a, b) => a.z - b.z);
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