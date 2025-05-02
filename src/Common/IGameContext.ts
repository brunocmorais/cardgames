import { GameOptions } from "./Model/GameOptions";

export interface IGameContext {
    drawGame(update: boolean): Promise<void>;
    resetGame() : void;
    startNewGame(gameNumber? : number) : void;
    setOptions(gameOptions : GameOptions) : Promise<void>;
    getHint() : boolean;
    fastForward() : Promise<void>;
    isGameWon() : boolean;
}
