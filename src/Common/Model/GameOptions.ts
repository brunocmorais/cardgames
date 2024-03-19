export class GameOptions {

    public deck! : string;
    public color! : string;
    public lastGame! : string;

    public save() {
        localStorage.setItem("deck", this.deck);
        localStorage.setItem("color", this.color);
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