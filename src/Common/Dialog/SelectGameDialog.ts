import { GameContextFactory } from "../GameContextFactory";
import { Dialog } from "./Dialog";
import { DialogButtons } from "./DialogButtons";

export class SelectGameDialog extends Dialog {

    constructor(buttons : DialogButtons, onSuccess : (dialog : HTMLDialogElement, result : boolean) => void) {
        const template = document.querySelector("body > .select-game-template") as HTMLTemplateElement;
        super(template.innerHTML, "Selecionar jogo", buttons, onSuccess);
    }

    public getSelectedGame()  {
        const value = ((this.getDialog()).querySelector(".list") as HTMLSelectElement).value;
        return { name : value, game : GameContextFactory.get(value) }; 
    }
}