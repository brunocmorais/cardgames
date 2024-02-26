const fonts = "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2";
const fontName = "FontAwesome";

export class GameBackground {

    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private readonly icons = [
        { code : '\uF067', x : 8 },
        { code : '\uf021', x : 6 },
        { code : '\uf0c9', x : 6 },
        { code : '\uf25a', x : 4 },
        { code : '\uf0eb', x : 14 },
        { code : '\uf054', x : 12 },
        { code : '\uf013', x : 6 },
    ];
    
    constructor(canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D) {

        this.canvas = canvas;
        this.ctx = ctx;
    }

    private async loadIconFont() {
        
        for (const font of document.fonts) 
            if (font.family === fontName)
                return;

        const font = new FontFace(fontName, `url(${fonts})`);
        document.fonts.add(await font.load());
    }

    public async draw() {
        
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        /*this.ctx.fillStyle = "#BBB";
        this.ctx.fillRect(0, 0, 56, this.canvas.height);

        this.ctx.fillStyle = "black";
        this.ctx.moveTo(56, 0);
        this.ctx.lineTo(56, this.canvas.height);
        this.ctx.stroke();

        await this.loadIconFont();

        this.ctx.font = '48px ' + fontName;
        let y = 0;

        for (const icon of this.icons)
            this.ctx.fillText(icon.code, icon.x, y += 70);
        */
    }
}