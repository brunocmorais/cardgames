import { BaseGameContext } from "../Common/BaseGameContext";
import { BaseCardsData } from "../Common/Data/BaseCardsData";
import { CardData } from "../Common/Data/CardData";
import { sleep } from "../Util/Functions";
import { GameData } from "./Data/GameData";
import { Solitaire } from "./Solitaire";

export class SolitaireGameContext extends BaseGameContext {

    private readonly data;
    private readonly solitaire;

    constructor() {
        super();

        document.title = "Solitaire - #" + 1;

        this.solitaire = new Solitaire(1);
        this.data = new GameData(this.canvas.width, this.solitaire);
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

        while (!this.data.cards.cardBack.complete)
            await sleep(100);

        for (let i = 0; i < this.getCardsData().length; i++) {
            const data = this.getCardsData().get(i);

            while (!data.image.complete)
                await sleep(100);
        }

        for (let i = 0; i < this.solitaire.tableau.length; i++) {
            for (let j = 0; j < this.solitaire.tableau.getColumn(i).length; j++) {
                const card = this.solitaire.tableau.getColumn(i).getCard(j);
                const cardData = this.getCardsData().getBy(card);

                if (card.flipped)
                    this.drawCardBack(cardData);
                else
                    this.drawCard(cardData);
            }
        }
    
        const movingCardsData = this.getCardsData().getDraggingCards();
        
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
        for (let i = 0; i < this.solitaire.foundation.length; i++) {
            const foundation = this.data.foundation.get(i);
            this.drawCell(this.data.foundation.image, foundation.x, foundation.y);

            const foundationCards = this.solitaire.foundation.get(i);

            if (foundationCards.length > 0)
                for (const foundationCard of foundationCards)
                    this.drawCard(this.getCardsData().getBy(foundationCard));
        }
    }

    public async drawGame(update : boolean) {
        super.drawGame(update);

        await this.drawCells();
        await this.drawCards();
    }
}