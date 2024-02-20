import { cardVerticalDistance, cardWidthPadding } from "../../Common/Model/Constants";
import { BaseCardsData } from "../../Common/Data/BaseCardsData";
import { Solitaire } from "../Solitaire";

export class CardsData extends BaseCardsData {
    private solitaire : Solitaire; 
    private tableauWidth: number;

    constructor(canvasWidth : number, freeCell : Solitaire) {

        super(canvasWidth);

        this.solitaire = freeCell;
        this.tableauWidth = cardWidthPadding * freeCell.tableau.length;

        this.update();
    }

    public update(canvasWidth : number | undefined = undefined) {

        if (canvasWidth)
            this.canvasWidth = canvasWidth;

        this.updateFoundationData();
        this.updateTableauData();
    }

    private updateTableauData() {
        for (let i = 0; i < this.solitaire.tableau.length; i++) {
            const column = this.solitaire.tableau.getColumn(i);

            const x = cardWidthPadding * (i % this.solitaire.tableau.length) + (Math.floor(this.canvasWidth / 2) - Math.floor(this.tableauWidth / 2));

            for (let j = 0; j < column.length; j++) {
                const card = column.getCard(j);
                const y = cardVerticalDistance * j + 140;
                const z = j + 1;

                const cardData = this.cardsData.filter(x => x.card === card)[0];

                if (!cardData)
                    this.cardsData.push(this.createCardData(card, x, y, z));
                else
                    cardData.setCardPosition(x, y, z);
            }
        }
    }

    private updateFoundationData() {
        for (let i = 0; i < this.solitaire.foundation.length; i++) {
            const foundation = this.solitaire.foundation.get(i);

            if (foundation) {
                const x = cardWidthPadding + (Math.floor(this.canvasWidth / 2));
                let z = 1;

                for (const card of foundation) {

                    const cardData = this.cardsData.filter(x => x.card === card)[0];

                    if (!cardData)
                        this.cardsData.push(this.createCardData(card, x, 20, z++));
                    else
                        cardData.setCardPosition(x, 20, z++);
                }
            }
        }
    }
}