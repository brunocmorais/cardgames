import { FreeCell } from "./FreeCell";
import { range, sleep } from "../Util/Functions";
import { MoveData } from "../Common/Data/MoveData";
import { Position } from "./Position";
import { CardData } from "../Common/Data/CardData";
import { Column } from "../Common/Model/Column";
import { FreeCellGameData } from "./Data/FreeCellGameData";
import { FreeCellVariant } from "./FreeCellVariant";
import { FreeCellFactory } from "./FreeCellFactory";
import { BaseGameContext } from "../Common/BaseGameContext";
import { BaseCardsData } from "../Common/Data/BaseCardsData";
import { cardNumbers } from "../Common/Model/Constants";

export class FreeCellGameContext extends BaseGameContext<FreeCell, FreeCellGameData> {
    
    constructor(variant : FreeCellVariant = FreeCellVariant.default) {

        let initialGame = Math.floor(Math.random() * Math.pow(2, 32));
        document.title = "FreeCell - #" + initialGame;

        const freeCell = new FreeCellFactory().get(variant, [initialGame]);
        super(freeCell, new FreeCellGameData(freeCell));
    }

    protected getCardsData() : BaseCardsData {
        return this.data.cards;
    }

    protected async doActionWithDblClickedCards(cardsClicked : CardData[]) {
        const cardClicked = cardsClicked.orderByDesc(x => x.z)[0];

        if (this.game.tryToMoveCardToSomewhere(cardClicked.card))
            await this.drawGame(true);
    }

    protected async doActionWithClick(e: MouseEvent): Promise<void> {
        // nothing to do
    }

    protected async doActionWithSelectedCards(cards : CardData[]) {
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
    }

    protected async doActionWithReleasedCards(cards: CardData[]) {
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
        const freeCellObjects = this.data.freeCells.filter(x => draggingCard.isCardAboveObject(x));

        if (freeCellObjects.length > 0)
            moveData = [...moveData, ...freeCellObjects.map(x => new MoveData(x.index, Position.freeCells))];

        const foundationObjects = this.data.foundation.filter(x => draggingCard.isCardAboveObject(x));

        if (foundationObjects.length > 0)
            moveData = [...moveData, ...foundationObjects.map(x => new MoveData(x.index, Position.foundation))];

        const cardObjects = this.getCardsData().filter(x => draggingCard.isCardAboveObject(x) &&
            draggingCards.indexOf(x) < 0).orderBy(x => x.z);

        if (cardObjects.length > 0) {
            moveData = [...moveData, ...cardObjects.map(x => {
                const column = this.game.tableau.getCardColumn(x.card) as Column;
                return new MoveData(this.game.tableau.indexOf(column), Position.columnWithCard);
            }).filter(x => x.index != -1)];
        }

        const columnObjects = this.data.columns.filter(x => draggingCard.isCardAboveObject(x));

        if (columnObjects.length > 0)
            moveData = [...moveData, ...columnObjects.map(x => new MoveData(x.index, Position.columnWithoutCard))];

        return moveData;
    }
    
    private async drawCells() {
    
        await this.drawFreeCells();
        await this.drawFoundation();
    }
    
    private async drawFoundation() {
        
        while (!this.image.complete)
            await sleep(100);
        
        const cardsData = this.getCardsData();

        for (let i = 0; i < this.game.foundation.length; i++) {
            const foundation = this.data.foundation.get(i);
            this.drawCell(foundation.x, foundation.y);

            const foundationCards = this.game.foundation.get(i);

            if (foundationCards.length > 0)
                for (const foundationCard of foundationCards)
                    this.drawCard(cardsData.getBy(foundationCard));
        }
    }

    private async drawFreeCells() {
        
        while (!this.image.complete)
            await sleep(100);

        for (let i = 0; i < this.game.cells.length; i++) {
            const freeCellData = this.data.freeCells.get(i);
            this.drawCell(freeCellData.x, freeCellData.y);

            const freeCellCard = this.game.cells.get(i);

            if (freeCellCard)
                this.drawCard(this.getCardsData().getBy(freeCellCard));
        }
    }

    private async drawCards() {
        
        while (!this.image.complete)
            await sleep(100);

        const cardsData = this.getCardsData();
        const movingCardsData = cardsData.getDraggingCards();

        for (const column of this.game.tableau.getColumns())
            for (const card of column.getCards())
                this.drawCard(cardsData.getBy(card));
        
        for (const cardData of movingCardsData)
            this.drawCard(cardData);
    }

    public async drawGame(update : boolean) {
        await super.drawGame(update);

        await this.drawCells();
        await this.drawCards();
    }

    public resetGame(): void {
        const freeCell = new FreeCellFactory().get(FreeCellVariant.default, [this.game.gameNumber]);
        this.game = freeCell;
        this.data = new FreeCellGameData(freeCell);
        this.data.update(this.canvas.width);
    }

    public startNewGame(gameNumber ? : number): void {
        let initialGame = gameNumber ?? Math.floor(Math.random() * Math.pow(2, 32));
        document.title = "FreeCell - #" + initialGame;
        const freeCell = new FreeCellFactory().get(FreeCellVariant.default, [initialGame]);
        this.game = freeCell;
        this.data = new FreeCellGameData(freeCell);
        this.data.update(this.canvas.width);
    }

    public getHint(): boolean {

        const cells = this.game.cells;
        const tableau = this.game.tableau;
        const foundation = this.game.foundation;
        
        for (let i = 0; i < cells.length; i++) {
            const card = cells.get(i);

            if (!card)
                continue;

            if (this.game.tryToMoveCardToSomewhere(card))
                return true;
        }

        for (let i = 0; i < tableau.length; i++) {
            const column = tableau.getColumn(i);
            const card = column.getCard(column.length - 1);

            if (!card)
                continue;

            for (let j = 0; j < foundation.length; j++)
                if (this.game.tryToMoveCardTo(Position.foundation, [ card ], j))
                    return true;
        }

        for (let i = 0; i < tableau.length; i++) {
            const column = tableau.getColumn(i);

            for (let j = 0; j < column.length; j++) {
                const card = column.getCard(j);
                const cardAbove = column.getCard(j - 1);

                if (cardAbove && cardNumbers.indexOf(cardAbove.number) === 
                    cardNumbers.indexOf(card.number) + 1 && cardAbove.isBlack != card.isBlack)
                    continue;

                const cards = column.getCardsBelow(card);

                if (this.game.checkIfCardCanStartMoving(card)) {
                    for (let k = 0; k < tableau.length; k++) {
                        if (i === k)
                            continue;

                        const possibleColumn = tableau.getColumn(k);
                        const possibleLastCard = possibleColumn.getCard(possibleColumn.length - 1);

                        if (j === 0 && !possibleLastCard)
                            continue;

                        if (cardAbove && possibleLastCard && 
                            cardAbove.number === possibleLastCard.number &&
                            cardAbove.isBlack === possibleLastCard.isBlack)
                            continue;

                        if (this.game.tryToMoveCardTo(Position.columnWithCard, [card, ...cards], k))
                            return true;
                    }
                }
            }
        }

        return false;
    }

    public isGameWon(): boolean {
        
        const foundations = this.game.foundation;

        for (let i = 0; i < foundations.length; i++) {
            
            const foundation = foundations.get(i);

            if (foundation.length == 0 || foundation[foundation.length - 1].number != 'K')
                return false;
        }

        return true;
    }
}