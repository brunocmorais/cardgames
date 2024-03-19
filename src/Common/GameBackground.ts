export class GameBackground {

    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private color : string = "green";

    constructor(canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D) {

        this.canvas = canvas;
        this.ctx = ctx;
    }

    public async draw() {
        
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public setColor(color : string) {
        this.color = color;
    }
}