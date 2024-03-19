import { GameOptions } from "./Model/GameOptions";

export interface IGameContext {
    drawGame(update: boolean): Promise<void>;
    resetGame() : void;
    newGame(gameNumber? : number) : void;
    setOptions(gameOptions : GameOptions) : Promise<void>;
    getHint() : void;
}
