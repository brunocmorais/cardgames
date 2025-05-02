import { Dialog } from "./Common/Dialog/Dialog";
import { DialogButtons } from "./Common/Dialog/DialogButtons";
import { GameNumberDialog } from "./Common/Dialog/GameNumberDialog";
import { SelectGameDialog } from "./Common/Dialog/SelectGameDialog";
import { SettingsDialog } from "./Common/Dialog/SettingsDialog";
import { IGameContext } from "./Common/IGameContext";
import { GameOptions } from "./Common/Model/GameOptions";

export class Sidebar {

    private selectGameDialog : SelectGameDialog;
    private game : IGameContext;
    private gameOptions : GameOptions;

    constructor(game : IGameContext, gameOptions : GameOptions) {
        this.game = game;
        this.gameOptions = gameOptions;
        this.selectGameDialog = new SelectGameDialog(DialogButtons.Ok, this.onSelectGame);
        this.defineEvents();
    }

    public showSelectGameDialog() {
        this.selectGameDialog.showDialog();
    }

    private onSelectGame = async (_ : HTMLDialogElement, result : boolean) => {
        
        if (result) {
            const selectedGame = this.selectGameDialog.getSelectedGame();
            
            if (selectedGame.game)
                this.game = selectedGame.game;
    
            this.gameOptions.lastGame = selectedGame.name;
            this.gameOptions.save();
    
            this.game.setOptions(this.gameOptions);
            
            await this.game.drawGame(false);
        }
    }

    private defineEvents() {
        this.defineSelectGameEvent(); 
        this.defineResetGameEvent();   
        this.defineNewGameEvent();  
        this.defineSettingsEvent();
        this.defineAboutEvent();
        this.defineSelectGameNumberEvent();
        this.defineGetHelpEvent();
        this.defineFastForwardEvent();
    }
    
    private defineSelectGameEvent() {

        document.getElementById("select-game")?.addEventListener("click", () => {
            this.selectGameDialog.showDialog();
        });
    }

    private defineResetGameEvent() {

        document.getElementById("reset-game")?.addEventListener("click", async () => {
            const dialog = new Dialog("Você tem certeza de que deseja reiniciar o jogo?", "Reiniciar jogo", DialogButtons.YesNo, 
                async (_, result) => { 
                    if (result) {
                        this.game.resetGame();
                        await this.game.drawGame(false);
                    }
                });

            dialog.showDialog();
        });
    }

    private defineNewGameEvent() {

        document.getElementById("new-game")?.addEventListener("click", async () => {
            const dialog = new Dialog("Você tem certeza de que deseja iniciar um novo jogo?", "Novo jogo", DialogButtons.YesNo, 
                async (_, result) => {
                    if (result) {
                        this.game.startNewGame();
                        await this.game.drawGame(false);
                    } 
                });

            dialog.showDialog();
        });
    }

    private defineSettingsEvent() {

        document.getElementById("settings")?.addEventListener("click", async () => {
            const dialog = new SettingsDialog((element, result) => {
                if (result) {
                    this.gameOptions = dialog.getSelectedOptions(element);
                    this.gameOptions.save();
                    this.game.setOptions(this.gameOptions);
                }                   
            });

            dialog.showDialog();
        });
    }

    private defineAboutEvent() {

        document.getElementById("about")?.addEventListener("click", () => {
            const template = document.querySelector(".template-about") as HTMLTemplateElement;
            const html = template.innerHTML.replace("{{year}}", new Date().getFullYear().toString());
            const dialog = new Dialog(html, "Sobre o CardGames", DialogButtons.Ok);
            dialog.showDialog();
        });
    }

    private defineSelectGameNumberEvent() {
        document.getElementById("select-game-number")?.addEventListener("click", () => {
            const dialog = new GameNumberDialog(async (_, result) => {

                if (result) {
                    const gameNumber = dialog.getSelectedNumber();
                    this.game.startNewGame(gameNumber);
                    await this.game.drawGame(false);
                }
            });

            dialog.showDialog();
        });
    }

    private defineGetHelpEvent() {
        document.getElementById("get-help")?.addEventListener("click", async () => {
            this.game.getHint();
            await this.game.drawGame(true);
        });
    }

    private defineFastForwardEvent() {
        document.getElementById("fast-forward")?.addEventListener("click", async () => {
            await this.game.fastForward();
        });
    }
}