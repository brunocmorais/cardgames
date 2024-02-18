import { FreeCell } from "./GameTypes/FreeCell";
import { sleep } from "../Util/Functions";
import { MoveData } from "../Common/Data/MoveData";
import { Position } from "./Position";
import { CardData } from "../Common/Data/CardData";
import { Column } from "../Common/Model/Column";
import { GameData } from "./Data/GameData";
import { GameType } from "./GameTypes/FreeCellGameType";
import { FreeCellFactory } from "./GameTypes/FreeCellFactory";
import { BaseGameContext } from "../Common/BaseGameContext";
import { BaseCardsData } from "../Common/Data/BaseCardsData";

export class FreeCellGameContext extends BaseGameContext {
    private freeCell : FreeCell;
    private data : GameData;
    
    constructor() {

        super();

        let initialGame = Math.floor(Math.random() * Math.pow(2, 32));
        let gameType = GameType.default;

        const href = window.location.href;

        if (href.indexOf("?") >= 0) {
            const searchParams = new URLSearchParams(href.substring(href.indexOf("?")));
            
            if (searchParams.has("g"))
                initialGame = parseInt("0" + searchParams.get("g"));

            if (searchParams.has("t"))
                gameType = ("" + searchParams.get("t") as string) as GameType;
        }

        document.title = "FreeCell - #" + initialGame;

        const factory = new FreeCellFactory();

        this.freeCell = factory.get(gameType, [initialGame]);
        this.data = new GameData(this.canvas.width, this.freeCell);
    }

    protected getCardsData() : BaseCardsData {
        return this.data.cards;
    }

    protected async doActionWithDblClickedCards(cardsClicked : CardData[]) {
        const cardClicked = cardsClicked.orderByDesc(x => x.z)[0];

        if (this.freeCell.tryToMoveCardToSomewhere(cardClicked.card))
            await this.drawGame(true);
    }

    protected async doActionWithSelectedCards(cards : CardData[]) {
        const cardData = cards.orderByDesc(x => x.z)[0];
        const card = cardData.card;

        if (this.freeCell.checkIfCardCanStartMoving(card)) {
            cardData.isDragging = true;
            const column = this.freeCell.tableau.getCardColumn(card);

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
                if (this.freeCell.tryToMoveCardTo(item.destination, cards.map(x => x.card), item.index))
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
                const column = this.freeCell.tableau.getCardColumn(x.card) as Column;
                return new MoveData(this.freeCell.tableau.indexOf(column), Position.columnWithCard);
            }).filter(x => x.index != -1)];
        }

        const columnObjects = this.data.columns.filter(x => draggingCard.isCardAboveObject(x));

        if (columnObjects.length > 0)
            moveData = [...moveData, ...columnObjects.map(x => new MoveData(x.index, Position.columnWithoutCard))];

        return moveData;
    }
    
    private async drawCells() {

        while (!this.data.freeCells.image.complete || !this.data.foundation.image.complete)
            await sleep(100);
    
        this.drawFreeCells();
        this.drawFoundation();
    }
    
    private drawFoundation() {
        for (let i = 0; i < this.freeCell.foundation.length; i++) {
            const foundation = this.data.foundation.get(i);
            this.drawCell(this.data.freeCells.image, foundation.x, foundation.y);

            const foundationCards = this.freeCell.foundation.get(i);

            if (foundationCards.length > 0)
                for (const foundationCard of foundationCards)
                    this.drawCard(this.getCardsData().getBy(foundationCard));
        }
    }

    private drawFreeCells() {
        for (let i = 0; i < this.freeCell.cells.length; i++) {
            const freeCellData = this.data.freeCells.get(i);
            this.drawCell(this.data.freeCells.image, freeCellData.x, freeCellData.y);

            const freeCellCard = this.freeCell.cells.get(i);

            if (freeCellCard)
                this.drawCard(this.getCardsData().getBy(freeCellCard));
        }
    }

    private async drawCards() {

        for (let i = 0; i < this.getCardsData().length; i++) {
            const data = this.getCardsData().get(i);

            while (!data.image.complete)
                await sleep(100);
        }

        for (let i = 0; i < this.freeCell.tableau.length; i++) {
            for (let j = 0; j < this.freeCell.tableau.getColumn(i).length; j++) {
                const card = this.freeCell.tableau.getColumn(i).getCard(j);
                const cardData = this.getCardsData().getBy(card);
                this.drawCard(cardData);
            }
        }
    
        const movingCardsData = this.getCardsData().getDraggingCards();
        
        if (movingCardsData.length > 0)
            for (const cardData of movingCardsData)
                this.drawCard(cardData);
    }

    public async drawGame(update : boolean) {
        super.drawGame(update);

        await this.drawCells();
        await this.drawCards();
    }
}