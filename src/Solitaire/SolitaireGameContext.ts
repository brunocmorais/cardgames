import { BaseGameContext } from "../Common/BaseGameContext";
import { BaseCardsData } from "../Common/Data/BaseCardsData";
import { CardData } from "../Common/Data/CardData";
import { sleep } from "../Util/Functions";
import { SolitaireGameData } from "./Data/SolitaireGameData";
import { Solitaire } from "./Solitaire";

export class SolitaireGameContext extends BaseGameContext<Solitaire, SolitaireGameData> {

    constructor() {
        document.title = "Solitaire - #" + 1;
        
        const solitaire = new Solitaire(1);
        const data = new SolitaireGameData(solitaire);
        super(solitaire, data);
    }

    protected getCardsData(): BaseCardsData {
        return this.data.cards;
    }

    protected doActionWithDblClickedCards(cardsClicked: CardData[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    protected doActionWithSelectedCards(cards: CardData[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    protected doActionWithReleasedCards(cards: CardData[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private async drawCards() {
        
        const cardsData = this.getCardsData();

        while (!cardsData.cardBack.complete)
            await sleep(100);

        for (let i = 0; i < cardsData.length; i++) {
            const data = cardsData.get(i);

            while (!data.image.complete)
                await sleep(100);
        }

        for (const column of this.game.tableau.getColumns()) {
            for (const card of column.getCards()) {
                const cardData = cardsData.getBy(card);

                if (card.flipped)
                    this.drawCardBack(cardData);
                else
                    this.drawCard(cardData);
            }
        }

        const movingCardsData = cardsData.getDraggingCards();
        
        if (movingCardsData.length > 0)
            for (const cardData of movingCardsData)
                this.drawCard(cardData);
    }

    private async drawCells() {

        while (!this.data.foundation.image.complete)
            await sleep(100);
    
        this.drawFoundation();
    }
    
    private drawFoundation() {
        const cardsData = this.getCardsData();

        for (let i = 0; i < this.game.foundation.length; i++) {
            const foundation = this.data.foundation.get(i);
            this.drawCell(this.data.foundation.image, foundation.x, foundation.y);

            const foundationCards = this.game.foundation.get(i);

            if (foundationCards.length > 0)
                for (const foundationCard of foundationCards)
                    this.drawCard(cardsData.getBy(foundationCard));
        }
    }

    public async drawGame(update : boolean) {
        super.drawGame(update);

        await this.drawCells();
        await this.drawCards();
    }
}