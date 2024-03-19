import { BaseGameContext } from "../Common/BaseGameContext";
import { BaseCardsData } from "../Common/Data/BaseCardsData";
import { CardData } from "../Common/Data/CardData";
import { MoveData } from "../Common/Data/MoveData";
import { Column } from "../Common/Model/Column";
import { sleep } from "../Util/Functions";
import { SolitaireGameData } from "./Data/SolitaireGameData";
import { Position } from "./Position";
import { Solitaire } from "./Solitaire";

export class SolitaireGameContext extends BaseGameContext<Solitaire, SolitaireGameData> {

    constructor() {

        let initialGame = Math.floor(Math.random() * Math.pow(2, 32));

        document.title = "Solitaire - #" + initialGame;
        
        const solitaire = new Solitaire(initialGame);
        const data = new SolitaireGameData(solitaire);
        super(solitaire, data);
    }

    protected getCardsData(): BaseCardsData {
        return this.data.cards;
    }

    protected async doActionWithDblClickedCards(cardsClicked: CardData[]): Promise<void> {
        const cardClicked = cardsClicked.orderByDesc(x => x.z)[0];

        if (this.game.tryToMoveCardToSomewhere(cardClicked.card))
            await this.drawGame(true);
    }

    protected async doActionWithClick(e : MouseEvent): Promise<void> {
        const coord = this.getTouchCoordinate(e);
        const cardClicked = this.data.cards.filter(x => x.isInsideCard(coord))
                .orderByDesc(x => x.z)[0];

        if (cardClicked) {
            const card = cardClicked.card;
            const [ position ] = this.game.getCardPosition(card); 
    
            if (position === Position.stack)
                this.game.dealCard();
            else if (card.flipped)
                this.game.flipCard(card);
        } else if (this.data.redistribution.stack.isInsideCell(coord)) {
            this.game.dealCard();
        }

        await this.drawGame(true);
    }

    protected async doActionWithSelectedCards(cards: CardData[]): Promise<void> {
        const cardData = cards.orderByDesc(x => x.z)[0];
        const card = cardData.card;

        if (this.game.checkIfCardCanStartMoving(card)) {
            cardData.isDragging = true;
            const column = this.game.tableau.getCardColumn(card);

            if (column) {
                for (const cardBelow of column.getCardsBelow(card)) {
                    const cardBelowData = this.getCardsData().getBy(cardBelow);
                    cardBelowData.isDragging = true;
                }
            }
        }

        await this.drawGame(true);
    }

    protected async doActionWithReleasedCards(cards: CardData[]): Promise<void> {
        
        const movingData = this.defineMovingDestination(cards);

        if (movingData.length > 0) {
            for (const item of movingData) {
                if (this.game.tryToMoveCardTo(item.destination, cards.map(x => x.card), item.index))
                    break;
            }
        }
        
        for (const draggingCard of cards)
            draggingCard.isDragging = false;

        await this.drawGame(true);
    }

    private defineMovingDestination(draggingCards : CardData[]) {

        let moveData : MoveData[] = [];
        const draggingCard = draggingCards[0];
        
        const foundationObjects = this.data.foundation.filter(x => draggingCard.isCardAboveObject(x));

        if (foundationObjects.length > 0)
            moveData = [...moveData, ...foundationObjects.map(x => new MoveData(x.index, Position.foundation))];

        const cardObjects = this.getCardsData().filter(x => draggingCard.isCardAboveObject(x) &&
            draggingCards.indexOf(x) < 0).orderBy(x => x.z);

        if (cardObjects.length > 0) {
            moveData = [...moveData, ...cardObjects.map(x => {
                const column = this.game.tableau.getCardColumn(x.card) as Column;
                return new MoveData(this.game.tableau.indexOf(column), Position.tableau);
            }).filter(x => x.index != -1)];
        }

        const columnObjects = this.data.columns.filter(x => draggingCard.isCardAboveObject(x));

        if (columnObjects.length > 0)
            moveData = [...moveData, ...columnObjects.map(x => new MoveData(x.index, Position.tableau))];

        return moveData;
    }

    private async drawCards() {
        
        const cardsData = this.getCardsData();

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

        while (!BaseCardsData.cardBack.complete)
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
        await super.drawGame(update);

        await this.drawCells();
        await this.drawCards();
    }

    public resetGame(): void {

        const solitaire = new Solitaire(this.game.gameNumber);
        this.game = solitaire;
        this.data = new SolitaireGameData(solitaire);
        this.data.update(this.canvas.width);
    }

    public newGame(gameNumber? : number): void {

        let initialGame = gameNumber ?? Math.floor(Math.random() * Math.pow(2, 32));
        document.title = "Solitaire - #" + initialGame;
        const solitaire = new Solitaire(initialGame);
        this.game = solitaire;
        this.data = new SolitaireGameData(solitaire);
        this.data.update(this.canvas.width);
    }

    public getHint(): void {
        throw new Error("Method not implemented.");
    }
}