import { Dialog } from './Common/Dialog/Dialog';
import { DialogButtons } from './Common/Dialog/DialogButtons';
import { GameNumberDialog } from './Common/Dialog/GameNumberDialog';
import { SelectGameDialog } from './Common/Dialog/SelectGameDialog';
import { SettingsDialog } from './Common/Dialog/SettingsDialog';
import { GameContextFactory } from './Common/GameContextFactory';
import { IGameContext } from './Common/IGameContext';
import { GameOptions } from './Common/Model/GameOptions';
import { EmptyGameContext } from './Empty/EmptyGameContext';

let game : IGameContext = new EmptyGameContext();
let gameOptions = GameOptions.load();
game.setOptions(gameOptions);

const onSelectGame = async (_ : HTMLDialogElement, result : boolean) => {

    if (result) {
        const selectedGame = dialog.getSelectedGame();
        
        if (selectedGame.game)
            game = selectedGame.game;

        gameOptions.lastGame = selectedGame.name;
        gameOptions.save();

        game.setOptions(gameOptions);
        
        await game.drawGame(false);
    }
};

let dialog : SelectGameDialog = new SelectGameDialog(DialogButtons.Ok, onSelectGame);

export class Main {

    public static defineEvents() {
        this.defineSelectGameEvent(); 
        this.defineResetGameEvent();   
        this.defineNewGameEvent();  
        this.defineSettingsEvent();
        this.defineAboutEvent();
        this.defineSelectGameNumberEvent();
        this.defineGetHelpEvent();
        this.defineFastForwardEvent();
    }

    private static defineSelectGameEvent() {

        document.getElementById("select-game")?.addEventListener("click", function() {
            const dialog = new SelectGameDialog(DialogButtons.OkCancel, onSelectGame);
            dialog.showDialog();
        });
    }

    private static defineResetGameEvent() {

        document.getElementById("reset-game")?.addEventListener("click", async function() {
            const dialog = new Dialog("Você tem certeza de que deseja reiniciar o jogo?", "Reiniciar jogo", DialogButtons.YesNo, 
                async (_, result) => { 
                    if (result) {
                        game.resetGame();
                        await game.drawGame(false);
                    }
                });

            dialog.showDialog();
        });
    }

    private static defineNewGameEvent() {

        document.getElementById("new-game")?.addEventListener("click", async function() {
            const dialog = new Dialog("Você tem certeza de que deseja iniciar um novo jogo?", "Novo jogo", DialogButtons.YesNo, 
                async (_, result) => {
                    if (result) {
                        game.newGame();
                        await game.drawGame(false);
                    } 
                });

            dialog.showDialog();
        });
    }

    private static defineSettingsEvent() {

        document.getElementById("settings")?.addEventListener("click", async function() {
            const dialog = new SettingsDialog((element, result) => {
                if (result) {
                    gameOptions = dialog.getSelectedOptions(element);
                    gameOptions.save();
                    game.setOptions(gameOptions);
                }                   
            });

            dialog.showDialog();
        });
    }

    private static defineAboutEvent() {

        document.getElementById("about")?.addEventListener("click", function() {
            const template = document.querySelector(".template-about") as HTMLTemplateElement;
            const dialog = new Dialog(template.innerHTML, "Sobre o CardGames", DialogButtons.Ok);
            dialog.showDialog();
        });
    }

    private static defineSelectGameNumberEvent() {
        document.getElementById("select-game-number")?.addEventListener("click", function() {
            const dialog = new GameNumberDialog(async (_, result) => {

                if (result) {
                    const gameNumber = dialog.getSelectedNumber();
                    game.newGame(gameNumber);
                    await game.drawGame(false);
                }
            });

            dialog.showDialog();
        });
    }

    private static defineGetHelpEvent() {
        document.getElementById("get-help")?.addEventListener("click", async function() {
            game.getHint();
            await game.drawGame(true);
        });
    }

    private static defineFastForwardEvent() {
        document.getElementById("fast-forward")?.addEventListener("click", async function() {
            await game.fastForward();
        });
    }
}

Main.defineEvents();

if (gameOptions.lastGame) {
    game = GameContextFactory.get(gameOptions.lastGame);
    game.setOptions(gameOptions);
}
else
    dialog.showDialog();

game.drawGame(false);