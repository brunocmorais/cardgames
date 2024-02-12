import { FreeCell } from "./freeCell.js";
import { sleep } from "./util.js"
import { cardDistance, cardSize } from './constants.js'
import { FreeCellsData } from "./freeCellsData.js";
import { FoundationData } from "./foundationData.js";
import { CardsData } from "./cardsData.js";
import { MoveData } from "./moveData.js";
import { Positions } from "./positions.js";
import { ColumnsData } from "./columnsData.js";

export class Game {

    constructor() {
        this.initializeCanvas();
        this.setupGame();
        this.setupEvents();
        this.drawGame();  
    }

    initializeCanvas() {
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupGame() {
        this.freeCell = new FreeCell();
        this.freeCellInfo = new FreeCellsData(this.canvas.width);
        this.foundationsInfo = new FoundationData(this.canvas.width);
        this.columnsInfo = new ColumnsData(this.canvas.width);
        this.cardsInfo = new CardsData(this.canvas.width, this.freeCell);
    }

    setupEvents() {
        this.canvas.addEventListener('mousedown', e => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', e => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', e => this.onMouseUp(e));
        window.addEventListener("resize", _ => this.resizeWindow());
    }

    onMouseDown(e) {
        const mouseX = e.clientX - this.canvas.getBoundingClientRect().left;
        const mouseY = e.clientY - this.canvas.getBoundingClientRect().top;

        const cardsClicked = this.cardsInfo.toArray().filter(x => this.isMouseInsideRect(x, mouseX, mouseY));

        if (cardsClicked.length > 0) {
            const cardInfo = cardsClicked.sort((a, b) => b.z - a.z)[0];

            if (this.freeCell.checkIfCardCanStartMoving(cardInfo.card))
            {
                cardInfo.isDragging = true;
                const column = this.freeCell.tableau.getCardColumn(cardInfo.card);

                if (column) {
                    const cardIndexOnColumn = column.indexOf(cardInfo.card);
                    const columnSize = column.size();

                    for (let i = cardIndexOnColumn + 1; i < columnSize; i++) {
                        const card = column.getCard(i);
                        const cardBelowInfo = this.cardsInfo.get(card);
                        cardBelowInfo.isDragging = true;
                    }
                }
            }
        }
    }

    async onMouseMove(e) {
        const cards = this.cardsInfo.getDraggingCards();

        if (cards.length > 0) {
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                card.x = Math.floor(e.clientX - this.canvas.getBoundingClientRect().left - cardSize.width / 2);
                card.y = Math.floor(e.clientY - this.canvas.getBoundingClientRect().top - cardSize.height / 2) + (i * 20);
            }

            await this.drawGame();
        }
    }

    async onMouseUp() {
        const draggingCards = this.cardsInfo.getDraggingCards();
    
        if (draggingCards.length > 0) {
    
            const movingInfo = this.defineMovingDestination(draggingCards);
            const multiCard = draggingCards.length > 1;

            if (movingInfo === undefined) {
                for (const draggingCard of draggingCards)
                    draggingCard.resetCardPosition();
            } else {
                switch (movingInfo.destination) {
                    case Positions.freeCells:
                        if (multiCard) {
                            for (const draggingCard of draggingCards)
                                draggingCard.resetCardPosition();
                        } else {
                            const draggingCard = draggingCards[0];
    
                            if (this.freeCell.tryToMoveCardToFreeCell(draggingCard.card, movingInfo.objectInfo.index))
                                draggingCard.setCardPosition(movingInfo.objectInfo.x, movingInfo.objectInfo.y, 1);
                            else
                                draggingCard.resetCardPosition();
                        }
                        break;
                    case Positions.foundation:
                        if (multiCard) {
                            for (const draggingCard of draggingCards)
                                draggingCard.resetCardPosition();
                        } else {
                            const draggingCard = draggingCards[0];
    
                            if (this.freeCell.tryToMoveCardToFoundation(draggingCard.card, movingInfo.objectInfo.index)) {
                                const foundation = this.freeCell.foundations.get(movingInfo.objectInfo.index);
                                draggingCard.setCardPosition(movingInfo.objectInfo.x, movingInfo.objectInfo.y, foundation.length + 1);
                            }
                            else
                                draggingCard.resetCardPosition();
                        }

                        break;
                    case Positions.columnWithCard:
                        const columnIndex = this.freeCell.tableau.indexOf(movingInfo.objectInfo.card);
                        const columnSize = this.freeCell.tableau.getColumn(columnIndex).size();

                        if (this.freeCell.tryToMoveCardsToColumn(draggingCards.map(x => x.card), columnIndex)) {
                            for (let i = 0; i < draggingCards.length; i++) {
                                const draggingCard = draggingCards[i];
                                draggingCard.setCardPosition(movingInfo.objectInfo.x, movingInfo.objectInfo.y + (cardDistance * (i + 1)), columnSize + 1 + i);
                            }
                        }
                        else {
                            for (const draggingCard of draggingCards)
                                draggingCard.resetCardPosition();
                        }
                        break;
                    case Positions.columnWithoutCard:
                        const emptyColumnIndex = movingInfo.objectInfo.index;

                        if (this.freeCell.tryToMoveCardsToColumn(draggingCards.map(x => x.card), emptyColumnIndex)) {
                            for (let i = 0; i < draggingCards.length; i++) {
                                const draggingCard = draggingCards[i];
                                draggingCard.setCardPosition(movingInfo.objectInfo.x, movingInfo.objectInfo.y + (cardDistance * i), i + 1);
                            }
                        }
                        else {
                            for (const draggingCard of draggingCards)
                                draggingCard.resetCardPosition();
                        }
                        break;
                }
            }

            for (const draggingCard of draggingCards)
                draggingCard.isDragging = false;

            await this.drawGame();

            if (this.freeCell.checkIfGameIsFinished()) {
                await sleep(100);
                alert("You win!");
            }
        }
    }

    async resizeWindow() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        await this.drawGame();
    }
    
    drawCard(card) {
        this.ctx.drawImage(card.image, card.x, card.y, card.image.width, card.image.height);
    }
    
    drawCell(cell, x, y) {
        this.ctx.drawImage(cell, x, y, cell.width, cell.height);
    }
    
    isMouseInsideRect(card, x, y) {
        return x > card.x && x < card.x + cardSize.width &&
            y > card.y && y < card.y + cardSize.height;
    }
    
    isMovingToFreeCell(cardInfo) {
        return this.freeCellInfo.toArray().filter(x => this.isCardAboveObject(cardInfo, x))[0];
    }

    defineMovingDestination(draggingCards) {

        const mainDraggingCard = draggingCards[0];
        const freeCellObjects = this.freeCellInfo.toArray().filter(x => this.isCardAboveObject(mainDraggingCard, x));

        if (freeCellObjects.length > 0)
            return new MoveData(freeCellObjects[freeCellObjects.length - 1], Positions.freeCells);

        const foundationObjects = this.foundationsInfo.toArray().filter(x => this.isCardAboveObject(mainDraggingCard, x));

        if (foundationObjects.length > 0)
            return new MoveData(foundationObjects[foundationObjects.length - 1], Positions.foundation);

        const cardObjects = this.cardsInfo.toArray().filter(x => this.isCardAboveObject(mainDraggingCard, x) &&
            draggingCards.indexOf(x) < 0).sort((a, b) => a.z - b.z);

        if (cardObjects.length > 0)
            return new MoveData(cardObjects[cardObjects.length - 1], Positions.columnWithCard);

        const columnObjects = this.columnsInfo.toArray().filter(x => this.isCardAboveObject(mainDraggingCard, x));

        if (columnObjects.length > 0)
            return new MoveData(columnObjects[columnObjects.length - 1], Positions.columnWithoutCard);

        return undefined;
    }
    
    isCardAboveObject(cardInfo, objectInfo) {
        return !(cardInfo.x > objectInfo.x + cardSize.width ||
            objectInfo.x > cardInfo.x + cardSize.width ||
            cardInfo.y > objectInfo.y + cardSize.height ||
            objectInfo.y > cardInfo.y + cardSize.height);
    }
    
    async drawCells() {
        const cell = new Image();
        cell.src = "cards/empty.png";
    
        while (!cell.complete)
            await sleep(100);
    
        for (let i = 0; i < 4; i++) {
            const freeCellInfo = this.freeCellInfo.toArray()[i];
            this.drawCell(cell, freeCellInfo.x, freeCellInfo.y);

            const freeCellCard = this.freeCell.freeCells.get(i);
    
            if (freeCellCard)
                this.drawCard(this.cardsInfo.get(freeCellCard));
        }
    
        for (let i = 0; i < 4; i++) {
            const foundation = this.foundationsInfo.toArray()[i];
            this.drawCell(cell, foundation.x, foundation.y);

            const foundationCards = this.freeCell.foundations.get(i);
    
            if (foundationCards.length > 0) {
                for (const foundationCard of foundationCards)
                    this.drawCard(this.cardsInfo.get(foundationCard));
            }
        }
    }
    
    async drawCards() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < this.freeCell.tableau.getColumn(i).size(); j++) {
                const card = this.freeCell.tableau.getColumn(i).getCard(j);
                const cardInfo = this.cardsInfo.get(card);
    
                while (!cardInfo.image.complete)
                    await sleep(100);
    
                this.drawCard(cardInfo);
            }
        }
    
        const movingCardsInfo = this.cardsInfo.getDraggingCards();
        
        if (movingCardsInfo.length > 0)
            for (const cardInfo of movingCardsInfo)
                this.drawCard(cardInfo);
    }
    
    async drawGame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        await this.drawCells();
        await this.drawCards();
    }
}