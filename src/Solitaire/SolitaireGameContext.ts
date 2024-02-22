import { BaseGameContext } from "../Common/BaseGameContext";
import { BaseCardsData } from "../Common/Data/BaseCardsData";
import { CardData } from "../Common/Data/CardData";
import { sleep } from "../Util/Functions";
import { SolitaireGameData } from "./Data/SolitaireGameData";
import { Position } from "./Position";
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

    protected async doActionWithClick(e : MouseEvent): Promise<void> {
        const coord = this.getTouchCoordinate(e);

        if (this.data.redistribution.stack.isInsideCell(coord))
            this.game.dealCard();

        await this.drawGame(true);
    }

    protected async doActionWithSelectedCards(cards: CardData[]): Promise<void> {
        const cardData = cards.orderByDesc(x => x.z)[0];
        cardData.isDragging = true;
        // const card = cardData.card;
        // const position = this.game.getCardPosition(card);

        // switch (position) {
        //     case Position.stack: 
        //         this.game.dealCard(); 
        //         break;
        // }

    }

    protected async doActionWithReleasedCards(cards: CardData[]): Promise<void> {
        
        for (const draggingCard of cards)
            draggingCard.isDragging = false;

        await this.drawGame(true);
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

        const redist = this.game.redistribution;

        for (let i = 0; i < redist.stack.length; i++)
            this.drawCardBack(this.data.cards.getBy(redist.stack.get(i)));
        
        for (let i = 0; i < redist.waste.length; i++)
            this.drawCard(this.data.cards.getBy(redist.waste.get(i)));

        const movingCardsData = cardsData.getDraggingCards();
        
        if (movingCardsData.length > 0)
            for (const cardData of movingCardsData)
                this.drawCard(cardData);
    }

    private async drawCells() {

        while (!this.data.foundation.image.complete)
            await sleep(100);

        while (!this.getCardsData().cardBack.complete)
            await sleep(100);
    
        this.drawFoundation();
        this.drawRedistribution();
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

    private drawRedistribution() {
        const redistData = this.data.redistribution;
        const image = redistData.image;
        const cards = redistData.stack;

        this.drawCell(image, cards.x, cards.y);
    }

    public async drawGame(update : boolean) {
        super.drawGame(update);

        await this.drawCells();
        await this.drawCards();
    }
}