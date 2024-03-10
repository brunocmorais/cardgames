import { FreeCell } from "./FreeCell";
import { sleep } from "../Util/Functions";
import { MoveData } from "../Common/Data/MoveData";
import { Position } from "./Position";
import { CardData } from "../Common/Data/CardData";
import { Column } from "../Common/Model/Column";
import { FreeCellGameData } from "./Data/FreeCellGameData";
import { FreeCellVariant } from "./FreeCellVariant";
import { FreeCellFactory } from "./FreeCellFactory";
import { BaseGameContext } from "../Common/BaseGameContext";
import { BaseCardsData } from "../Common/Data/BaseCardsData";

export class FreeCellGameContext extends BaseGameContext<FreeCell, FreeCellGameData> {
    
    constructor() {
        let { initialGame, variant } = FreeCellGameContext.extractURLParams();

        if (initialGame === 0)
            initialGame = Math.floor(Math.random() * Math.pow(2, 32));
        
        document.title = "FreeCell - #" + initialGame;

        const freeCell = new FreeCellFactory().get(variant, [initialGame]);
        super(freeCell, new FreeCellGameData(freeCell));
    }

    private static extractURLParams() {
        let initialGame = 0;
        let variant = FreeCellVariant.default;

        const href = window.location.href;

        if (href.indexOf("?") >= 0) {
            const searchParams = new URLSearchParams(href.substring(href.indexOf("?")));

            if (searchParams.has("g"))
                initialGame = parseInt("0" + searchParams.get("g"));

            if (searchParams.has("t"))
                variant = (searchParams.get("t") as string) as FreeCellVariant;
        }

        return { initialGame, variant };
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

        while (!this.data.freeCells.image.complete || !this.data.foundation.image.complete)
            await sleep(100);
    
        this.drawFreeCells();
        this.drawFoundation();
    }
    
    private drawFoundation() {
        const cardsData = this.getCardsData();

        for (let i = 0; i < this.game.foundation.length; i++) {
            const foundation = this.data.foundation.get(i);
            this.drawCell(this.data.freeCells.image, foundation.x, foundation.y);

            const foundationCards = this.game.foundation.get(i);

            if (foundationCards.length > 0)
                for (const foundationCard of foundationCards)
                    this.drawCard(cardsData.getBy(foundationCard));
        }
    }

    private drawFreeCells() {
        for (let i = 0; i < this.game.cells.length; i++) {
            const freeCellData = this.data.freeCells.get(i);
            this.drawCell(this.data.freeCells.image, freeCellData.x, freeCellData.y);

            const freeCellCard = this.game.cells.get(i);

            if (freeCellCard)
                this.drawCard(this.getCardsData().getBy(freeCellCard));
        }
    }

    private async drawCards() {

        const cardsData = this.getCardsData();
        const movingCardsData = cardsData.getDraggingCards();

        for (let i = 0; i < cardsData.length; i++) {
            const data = cardsData.get(i);

            while (!data.image.complete)
                await sleep(100);
        }

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
}