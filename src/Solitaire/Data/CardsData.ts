import { cardVerticalDistance, cardWidthPadding } from "../../Common/Model/Constants";
import { BaseCardsData } from "../../Common/Data/BaseCardsData";
import { Solitaire } from "../Solitaire";

export class CardsData extends BaseCardsData {
    private solitaire : Solitaire; 
    private tableauWidth: number;

    constructor(canvasWidth : number, solitaire : Solitaire) {

        super(canvasWidth);

        this.solitaire = solitaire;
        this.tableauWidth = cardWidthPadding * solitaire.tableau.length;

        this.update();
    }

    public update(canvasWidth : number | undefined = undefined) {

        if (canvasWidth)
            this.canvasWidth = canvasWidth;

        this.updateFoundationData();
        this.updateTableauData();
        this.updateRedistributionData();
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
        const foundationCount = this.solitaire.foundation.length;
        const cellsWidth = cardWidthPadding * (foundationCount);

        for (let i = 0; i < foundationCount; i++) {
            const foundation = this.solitaire.foundation.get(i);
            const x = (cardWidthPadding * (i + 1.5)) + (Math.floor(this.canvasWidth / 2) - Math.floor(cellsWidth / 2));
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

    private updateRedistributionData() {
        const redist = this.solitaire.redistribution;
        const calculateX = (padding : number) => (cardWidthPadding * padding) + (Math.floor((this.canvasWidth / 2) - cardWidthPadding));
        
        const arrays = [redist.stack, redist.waste];

        for (const [index, array] of arrays.entries()) {

            for (let i = 0; i < array.length; i++) {
                const card = array.get(i);
                const cardData = this.cardsData.filter(x => x.card === card)[0];
                const offset = Math.floor(i / 6) * 2;
                const position = index === 0 ? -2.5 : -1.5;
    
                if (!cardData)
                    this.cardsData.push(this.createCardData(card, calculateX(position) - offset, 20 - offset, i + 1));
                else
                    cardData.setCardPosition(calculateX(position) - offset, 20 - offset, i + 1);
            }
        }
    }
}