export class GameOptions {

    public deck! : string;
    public color! : string;
    public lastGame! : string;

    public save() {
        
        if (this.deck)
            localStorage.setItem("deck", this.deck);

        if (this.color)
            localStorage.setItem("color", this.color);

        if (this.lastGame)
            localStorage.setItem("lastGame", this.lastGame);
    }

    public static load() {
        let options = new GameOptions();

        options.deck = localStorage.getItem("deck") ?? "";
        options.color = localStorage.getItem("color") ?? "";
        options.lastGame = localStorage.getItem("lastGame") ?? "";

        return options;
    }
}