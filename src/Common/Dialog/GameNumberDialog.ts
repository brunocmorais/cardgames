import { Dialog } from "./Dialog";
import { DialogButtons } from "./DialogButtons";

export class GameNumberDialog extends Dialog {

    constructor(onClose?: ((dialog: HTMLDialogElement, result: boolean) => void)) {
        const template = document.querySelector(".template-game-number") as HTMLTemplateElement;
        super(template.innerHTML, "Número do jogo", DialogButtons.OkCancel, onClose);
    }

    public getSelectedNumber() {
        const dialog = this.getDialog();
        const input = dialog.querySelector("#game-number") as HTMLInputElement;
        return parseInt("0" + input.value);
    }
}