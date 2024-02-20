import { cardVerticalDistance, cardSize } from './Model/Constants';
import { CardData } from "./Data/CardData";
import { Coordinate } from "./Model/Coordinate";
import { BaseCardsData } from './Data/BaseCardsData';
import { IGameData } from './Data/IGameData';
import { IGameContext } from './IGameContext';
import { IGame } from './IGame';

export abstract class BaseGameContext<TGame extends IGame, TData extends IGameData> implements IGameContext {

    protected canvas : HTMLCanvasElement;
    protected ctx : CanvasRenderingContext2D;
    protected game : TGame;
    protected data : TData;
    
    constructor(game: TGame, data : TData) {
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

        this.game = game;
        this.data = data;
        this.data.update(this.canvas.width);
        
        this.setupEvents();
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

    protected abstract getCardsData() : BaseCardsData;
    
    protected getDraggingCards(): CardData[] {
        return this.getCardsData().getDraggingCards();
    }

    private async onMouseDblClick(e : MouseEvent) {
        
        const cardsClicked = this.getSelectedCards(e);
        
        if (cardsClicked.length === 0)
            return;
        
        await this.doActionWithDblClickedCards(cardsClicked);
    }

    protected abstract doActionWithDblClickedCards(cardsClicked : CardData[]) : Promise<void>;

    protected getTouchCoordinate(e : Event) {
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

    protected getSelectedCards(e : Event) {
        const coord = this.getTouchCoordinate(e);
        return this.getCardsData().filter(x => x.isInsideCard(coord));
    }

    private async onMouseDown(e : Event) {
        
        const cardsClicked = this.getSelectedCards(e);

        if (cardsClicked.length > 0)
            await this.doActionWithSelectedCards(cardsClicked);
    }

    protected abstract doActionWithSelectedCards(cards : CardData[]) : Promise<void>;

    private async onMouseMove(e : Event) {
        const cards = this.getDraggingCards();

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
        const draggingCards = this.getDraggingCards();
    
        if (draggingCards.length > 0)
            await this.doActionWithReleasedCards(draggingCards);
    }

    protected abstract doActionWithReleasedCards(cards: CardData[]) : Promise<void>;

    private async resizeWindow() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.data.update(this.canvas.width);
        await this.drawGame(false);
    }
    
    protected drawCard(card : CardData) {
        this.ctx.drawImage(card.image, card.x, card.y, card.image.width, card.image.height);
    }

    protected drawCardBack(card : CardData) {
        this.ctx.drawImage(this.getCardsData().cardBack, card.x, card.y, card.image.width, card.image.height);
    }
    
    protected drawCell(cell : HTMLImageElement, x : number, y : number) {
        this.ctx.drawImage(cell, x, y, cell.width, cell.height);
    }
    
    public async drawGame(update : boolean) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        if (update)
            this.getCardsData().update(this.canvas.width);
    }
}