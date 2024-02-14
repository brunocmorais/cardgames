import { FreeCell } from "./FreeCell.js";
import { sleep } from "./Util.js";
import { cardSize } from './Constants.js';
import { FreeCellsData } from "./data/FreeCellsData.js";
import { FoundationData } from "./data/FoundationData.js";
import { CardsData } from "./data/CardsData.js";
import { MoveData } from "./data/MoveData.js";
import { Positions } from "./Positions.js";
import { ColumnsData } from "./data/ColumnsData.js";
export class Game {
    canvas;
    ctx;
    freeCell;
    freeCellsData;
    foundationData;
    columnsData;
    cardsData;
    constructor() {
        const element = document.getElementById("canvas");
        if (!element)
            throw new Error("Canvas element not found!");
        this.canvas = element;
        const ctx = this.canvas.getContext('2d');
        if (!ctx)
            throw new Error("Canvas context could not be created!");
        this.ctx = ctx;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        let initialGame = Math.floor(Math.random() * Math.pow(2, 32));
        if (window.location.href.indexOf("?") >= 0) {
            const searchParams = new URLSearchParams(window.location.href.substring(window.location.href.indexOf("?")));
            if (searchParams.has("g"))
                initialGame = parseInt("0" + searchParams.get("g"));
        }
        document.title = "FreeCell - #" + initialGame;
        const cell = new Image();
        cell.src = "cards/empty.png";
        this.freeCell = new FreeCell(initialGame);
        this.freeCellsData = new FreeCellsData(this.canvas.width, cell);
        this.foundationData = new FoundationData(this.canvas.width, cell);
        this.columnsData = new ColumnsData(this.canvas.width);
        this.cardsData = new CardsData(this.canvas.width, this.freeCell);
        this.setupEvents();
        this.drawGame(false);
    }
    setupEvents() {
        this.canvas.addEventListener('mousedown', e => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', e => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', _ => this.onMouseUp());
        this.canvas.addEventListener('dblclick', e => this.onMouseDblClick(e));
        this.canvas.addEventListener('touchstart', e => this.onMouseDown(e));
        this.canvas.addEventListener('touchmove', e => this.onMouseMove(e));
        this.canvas.addEventListener('touchend', _ => this.onMouseUp());
        window.addEventListener("resize", _ => this.resizeWindow());
    }
    async onMouseDblClick(e) {
        const mouseX = e.clientX - this.canvas.getBoundingClientRect().left;
        const mouseY = e.clientY - this.canvas.getBoundingClientRect().top;
        const cardsClicked = this.cardsData.toArray().filter(x => x.isMouseInsideCard(mouseX, mouseY));
        if (cardsClicked.length === 0)
            return;
        const cardClicked = cardsClicked.sort((a, b) => b.z - a.z)[0];
        if (this.freeCell.tryToMoveCardToWithoutDestination(cardClicked.card))
            await this.drawGame(true);
    }
    onMouseDown(e) {
        let mouseX, mouseY;
        if (e instanceof MouseEvent) {
            mouseX = e.clientX - this.canvas.getBoundingClientRect().left;
            mouseY = e.clientY - this.canvas.getBoundingClientRect().top;
        }
        else if (e instanceof TouchEvent) {
            mouseX = e.touches[0].clientX - this.canvas.getBoundingClientRect().left;
            mouseY = e.touches[0].clientY - this.canvas.getBoundingClientRect().top;
        }
        const cardsClicked = this.cardsData.toArray().filter(x => x.isMouseInsideCard(mouseX, mouseY));
        if (cardsClicked.length > 0) {
            const cardInfo = cardsClicked.sort((a, b) => b.z - a.z)[0];
            if (this.freeCell.checkIfCardCanStartMoving(cardInfo.card)) {
                cardInfo.isDragging = true;
                const column = this.freeCell.tableau.getCardColumn(cardInfo.card);
                if (column) {
                    const cardIndexOnColumn = column.indexOf(cardInfo.card);
                    const columnSize = column.length;
                    for (let i = cardIndexOnColumn + 1; i < columnSize; i++) {
                        const card = column.getCard(i);
                        const cardBelowInfo = this.cardsData.get(card);
                        cardBelowInfo.isDragging = true;
                    }
                }
            }
        }
    }
    async onMouseMove(e) {
        const cards = this.cardsData.getDraggingCards();
        if (cards.length > 0) {
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                if (e instanceof MouseEvent) {
                    card.x = Math.floor(e.clientX - this.canvas.getBoundingClientRect().left - cardSize.width / 2);
                    card.y = Math.floor(e.clientY - this.canvas.getBoundingClientRect().top - cardSize.height / 2) + (i * 20);
                }
                else if (e instanceof TouchEvent) {
                    card.x = Math.floor(e.touches[0].clientX - this.canvas.getBoundingClientRect().left - cardSize.width / 2);
                    card.y = Math.floor(e.touches[0].clientY - this.canvas.getBoundingClientRect().top - cardSize.height / 2) + (i * 20);
                }
            }
            await this.drawGame(false);
        }
    }
    async onMouseUp() {
        const draggingCards = this.cardsData.getDraggingCards();
        if (draggingCards.length > 0) {
            const movingInfo = this.defineMovingDestination(draggingCards);
            if (movingInfo.length > 0) {
                for (const movingInfoItem of movingInfo) {
                    if (this.freeCell.tryToMoveCardTo(movingInfoItem.destination, draggingCards.map(x => x.card), movingInfoItem.index))
                        break;
                }
            }
            for (const draggingCard of draggingCards)
                draggingCard.isDragging = false;
            await this.drawGame(true);
        }
    }
    async resizeWindow() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.freeCellsData.update(this.canvas.width);
        this.foundationData.update(this.canvas.width);
        this.columnsData.update(this.canvas.width);
        this.cardsData.update(this.canvas.width);
        await this.drawGame(false);
    }
    drawCard(card) {
        this.ctx.drawImage(card.image, card.x, card.y, card.image.width, card.image.height);
    }
    drawCell(cell, x, y) {
        this.ctx.drawImage(cell, x, y, cell.width, cell.height);
    }
    isMovingToFreeCell(cardInfo) {
        return this.freeCellsData.toArray().filter(x => cardInfo.isCardAboveObject(x))[0];
    }
    defineMovingDestination(draggingCards) {
        const draggingCard = draggingCards[0];
        const freeCellObjects = this.freeCellsData.toArray().filter(x => draggingCard.isCardAboveObject(x));
        if (freeCellObjects.length > 0)
            return freeCellObjects.map(x => new MoveData(x.index, Positions.freeCells));
        const foundationObjects = this.foundationData.toArray().filter(x => draggingCard.isCardAboveObject(x));
        if (foundationObjects.length > 0)
            return foundationObjects.map(x => new MoveData(x.index, Positions.foundation));
        const cardObjects = this.cardsData.toArray().filter(x => draggingCard.isCardAboveObject(x) &&
            draggingCards.indexOf(x) < 0).sort((a, b) => a.z - b.z);
        if (cardObjects.length > 0) {
            return cardObjects.map(x => {
                const column = this.freeCell.tableau.getCardColumn(x.card);
                return new MoveData(this.freeCell.tableau.indexOf(column), Positions.columnWithCard);
            });
        }
        const columnObjects = this.columnsData.toArray().filter(x => draggingCard.isCardAboveObject(x));
        if (columnObjects.length > 0)
            return columnObjects.map(x => new MoveData(x.index, Positions.columnWithoutCard));
        return [];
    }
    async drawCells() {
        while (!this.freeCellsData.image.complete)
            await sleep(100);
        for (let i = 0; i < 4; i++) {
            const freeCellInfo = this.freeCellsData.toArray()[i];
            this.drawCell(this.freeCellsData.image, freeCellInfo.x, freeCellInfo.y);
            const freeCellCard = this.freeCell.freeCells.get(i);
            if (freeCellCard)
                this.drawCard(this.cardsData.get(freeCellCard));
        }
        for (let i = 0; i < 4; i++) {
            const foundation = this.foundationData.toArray()[i];
            this.drawCell(this.freeCellsData.image, foundation.x, foundation.y);
            const foundationCards = this.freeCell.foundations.get(i);
            if (foundationCards.length > 0) {
                for (const foundationCard of foundationCards)
                    this.drawCard(this.cardsData.get(foundationCard));
            }
        }
    }
    async drawCards() {
        for (const data of this.cardsData.toArray())
            while (!data.image.complete)
                await sleep(100);
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < this.freeCell.tableau.getColumn(i).length; j++) {
                const card = this.freeCell.tableau.getColumn(i).getCard(j);
                const cardInfo = this.cardsData.get(card);
                this.drawCard(cardInfo);
            }
        }
        const movingCardsInfo = this.cardsData.getDraggingCards();
        if (movingCardsInfo.length > 0)
            for (const cardInfo of movingCardsInfo)
                this.drawCard(cardInfo);
    }
    async drawGame(update) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        if (update)
            this.cardsData.update();
        await this.drawCells();
        await this.drawCards();
    }
}
