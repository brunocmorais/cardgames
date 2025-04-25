import { cardVerticalDistance, cardSize } from './Model/Constants';
import { CardData } from "./Data/CardData";
import { Coordinate } from "./Model/Coordinate";
import { BaseCardsData } from './Data/BaseCardsData';
import { IGameData } from './Data/IGameData';
import { IGameContext } from './IGameContext';
import { IGame } from './IGame';
import { GameBackground } from './GameBackground';
import { GameOptions } from './Model/GameOptions';
import { sleep } from '../Util/Functions';
import { Dialog } from './Dialog/Dialog';
import { DialogButtons } from './Dialog/DialogButtons';

export abstract class BaseGameContext<TGame extends IGame, TData extends IGameData> implements IGameContext {

    private background : GameBackground;
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

        this.canvas.width = window.innerWidth - 64;
        this.canvas.height = window.innerHeight;

        this.game = game;
        this.data = data;

        this.background = new GameBackground(this.canvas, this.ctx);
        this.data.update(this.canvas.width);
        
        this.setupEvents();
    }

    public abstract resetGame() : void;
    public abstract newGame(gameNumber? : number) : void;
    public abstract getHint() : boolean;
    public abstract isGameWon() : boolean;

    private setupEvents() {

        this.canvas.onmousedown = (e => this.onMouseDown(e));
        this.canvas.onmousemove = (e => this.onMouseMove(e));
        this.canvas.onmouseup = (_ => this.onMouseUp());
        this.canvas.ondblclick = (e => this.onMouseDblClick(e));
        this.canvas.onclick = (e => this.onMouseClick(e));
        this.canvas.ontouchstart = (e => this.onMouseDown(e));
        this.canvas.ontouchmove = (e => this.onMouseMove(e));
        this.canvas.ontouchend = (_ => this.onMouseUp());

        window.onresize = _ => this.resizeWindow();
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

    private async onMouseClick(e : MouseEvent) {
        await this.doActionWithClick(e);
    }

    protected abstract doActionWithDblClickedCards(cardsClicked : CardData[]) : Promise<void>;

    protected abstract doActionWithClick(e : MouseEvent) : Promise<void>;

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
        this.canvas.width = window.innerWidth - 64;
        this.canvas.height = window.innerHeight;
        this.data.update(this.canvas.width);
        await this.drawGame(false);
    }
    
    protected drawCard(card : CardData) {
        const imgCoord = card.card.imageCoordinate;
        this.ctx.drawImage(BaseCardsData.image, 
            imgCoord.x * cardSize.width, imgCoord.y * cardSize.height, cardSize.width, cardSize.height,
            card.x, card.y, cardSize.width, cardSize.height);
    }

    protected drawCardBack(card : CardData) {
        const color = BaseCardsData.color;
        let imgCoord : Coordinate;

        switch (color) {
            case "deck-red": imgCoord = { x : 6, y : 6 }; break;
            case "deck-blue": imgCoord = { x : 5, y : 6 }; break;
            case "deck-black": imgCoord = { x : 4, y : 6 }; break;
            default: return;
        }

        this.ctx.drawImage(BaseCardsData.image, 
            imgCoord.x * cardSize.width, imgCoord.y * cardSize.height, cardSize.width, cardSize.height,
            card.x, card.y, cardSize.width, cardSize.height);
    }
    
    protected drawCell(x : number, y : number) {
        const imgCoord : Coordinate = { x: 7, y : 6 };

        this.ctx.drawImage(BaseCardsData.image, 
            imgCoord.x * cardSize.width, imgCoord.y * cardSize.height, cardSize.width, cardSize.height,
            x, y, cardSize.width, cardSize.height);
    }
    
    public async drawGame(update : boolean) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        await this.background.draw();
    
        if (update) {
            this.getCardsData().update(this.canvas.width);

            if (this.isGameWon())
                new Dialog("Parabéns, você venceu!", "Parabéns", DialogButtons.Ok).showDialog();
        }
    }

    public async setOptions(gameOptions: GameOptions): Promise<void> {
        
        if (gameOptions.color)
            this.background.setColor(gameOptions.color);

        if (gameOptions.deck)
            this.getCardsData().setCardBack(gameOptions.deck);

        await this.drawGame(true);
    }

    public async fastForward(): Promise<void> {
        
        while (this.getHint()) {
            await sleep(300);
            await this.drawGame(true);
        }
    }

}