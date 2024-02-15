import { FreeCell } from "./FreeCell.js";
import { sleep } from "./Util.js"
import { cardVerticalDistance, cardSize } from './Constants.js'
import { MoveData } from "./data/MoveData.js";
import { Position } from "./Position.js";
import { CardData } from "./data/CardData.js";
import { Column } from "./Column.js";
import { Coordinate } from "./Coordinate.js";
import { GameData } from "./data/GameData.js";
import { GameType } from "./GameType.js";

export class Game {

    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private freeCell : FreeCell;
    private data : GameData;
    
    constructor() {
        const element = document.getElementById("canvas");

        if (!element)
            throw new Error("Canvas element not found!");

        this.canvas = element as HTMLCanvasElement;
        const ctx = this.canvas.getContext('2d');

        if (!ctx)
            throw new Error("Canvas context could not be created!");

        this.ctx = ctx;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
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

        this.freeCell = new FreeCell(initialGame, gameType);
        this.data = new GameData(this.canvas.width, this.freeCell);

        this.setupEvents();
        this.drawGame(false);
    }

    private setupEvents() {
        this.canvas.addEventListener('mousedown', e => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', e => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', _ => this.onMouseUp());
        this.canvas.addEventListener('dblclick', e => this.onMouseDblClick(e));

        this.canvas.addEventListener('touchstart', e => this.onMouseDown(e));
        this.canvas.addEventListener('touchmove', e => this.onMouseMove(e));
        this.canvas.addEventListener('touchend', _ => this.onMouseUp());

        window.addEventListener("resize", _ => this.resizeWindow());
    }

    private async onMouseDblClick(e : MouseEvent) {
        
        const cardsClicked = this.getSelectedCards(e);
        
        if (cardsClicked.length === 0)
            return;
        
        const cardClicked = cardsClicked.sort((a, b) => b.z - a.z)[0];

        if (this.freeCell.tryToMoveCardToSomewhere(cardClicked.card))
            await this.drawGame(true);
    }

    private getTouchCoordinate(e : Event) {
        if (e instanceof MouseEvent) {
            return new Coordinate(
                e.clientX - this.canvas.getBoundingClientRect().left,
                e.clientY - this.canvas.getBoundingClientRect().top
            );
        } else if (e instanceof TouchEvent) {
            return new Coordinate(
                e.touches[0].clientX - this.canvas.getBoundingClientRect().left,
                e.touches[0].clientY - this.canvas.getBoundingClientRect().top
            );
        }

        return new Coordinate(-1, -1);
    }

    private getSelectedCards(e : Event) {
        const coord = this.getTouchCoordinate(e);
        return this.data.cards.filter(x => x.isMouseInsideCard(coord.x, coord.y));
    }

    private onMouseDown(e : Event) {
        
        const cardsClicked = this.getSelectedCards(e);

        if (cardsClicked.length > 0) {
            const cardData = cardsClicked.sort((a, b) => b.z - a.z)[0];
            const card = cardData.card;

            if (this.freeCell.checkIfCardCanStartMoving(card))
            {
                cardData.isDragging = true;
                const column = this.freeCell.tableau.getCardColumn(card);

                if (column) {
                    for (const cardBelow of column.getCardsBelow(card)) {
                        const cardBelowData = this.data.cards.getBy(cardBelow);
                        cardBelowData.isDragging = true;
                    }
                }
            }
        }
    }

    private async onMouseMove(e : Event) {
        const cards = this.data.cards.getDraggingCards();

        if (cards.length > 0) {
            for (let i = 0; i < cards.length; i++) {
                const coord = this.getTouchCoordinate(e);
                cards[i].x = Math.floor(coord.x - cardSize.width / 2);
                cards[i].y = Math.floor(coord.y - cardSize.height / 2) + (i * cardVerticalDistance);
            }

            await this.drawGame(false);
        }
    }

    private async onMouseUp() {
        const draggingCards = this.data.cards.getDraggingCards();
    
        if (draggingCards.length > 0) {
            const movingData = this.defineMovingDestination(draggingCards);

            if (movingData.length > 0) {
                for (const item of movingData) {
                    if (this.freeCell.tryToMoveCardTo(item.destination, draggingCards.map(x => x.card), item.index))
                        break;
                }
            }
            
            for (const draggingCard of draggingCards)
                draggingCard.isDragging = false;

            await this.drawGame(true);
        }
    }

    private async resizeWindow() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.data.update(this.canvas.width);
        await this.drawGame(false);
    }
    
    private drawCard(card : CardData) {
        this.ctx.drawImage(card.image, card.x, card.y, card.image.width, card.image.height);
    }
    
    private drawCell(cell : HTMLImageElement, x : number, y : number) {
        this.ctx.drawImage(cell, x, y, cell.width, cell.height);
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

        const cardObjects = this.data.cards.filter(x => draggingCard.isCardAboveObject(x) &&
            draggingCards.indexOf(x) < 0).sort((a, b) => a.z - b.z);

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
                    this.drawCard(this.data.cards.getBy(foundationCard));
        }
    }

    private drawFreeCells() {
        for (let i = 0; i < this.freeCell.cells.length; i++) {
            const freeCellData = this.data.freeCells.get(i);
            this.drawCell(this.data.freeCells.image, freeCellData.x, freeCellData.y);

            const freeCellCard = this.freeCell.cells.get(i);

            if (freeCellCard)
                this.drawCard(this.data.cards.getBy(freeCellCard));
        }
    }

    private async drawCards() {

        for (let i = 0; i < this.data.cards.length; i++) {
            const data = this.data.cards.get(i);

            while (!data.image.complete)
                await sleep(100);
        }

        for (let i = 0; i < this.freeCell.tableau.length; i++) {
            for (let j = 0; j < this.freeCell.tableau.getColumn(i).length; j++) {
                const card = this.freeCell.tableau.getColumn(i).getCard(j);
                const cardData = this.data.cards.getBy(card);
                this.drawCard(cardData);
            }
        }
    
        const movingCardsData = this.data.cards.getDraggingCards();
        
        if (movingCardsData.length > 0)
            for (const cardData of movingCardsData)
                this.drawCard(cardData);
    }
    
    private async drawGame(update : boolean) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        if (update)
            this.data.cards.update();

        await this.drawCells();
        await this.drawCards();
    }
}