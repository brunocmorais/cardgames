import { GameOptions } from "../Model/GameOptions";
import { Dialog } from "./Dialog";
import { DialogButtons } from "./DialogButtons";

export class SettingsDialog extends Dialog {

    constructor(onSuccess : (dialog : HTMLDialogElement, result : boolean) => void) {
        const template = document.querySelector("body > .settings-template") as HTMLTemplateElement; 
        super(template.innerHTML, "Configurações", DialogButtons.OkCancel, onSuccess);
        this.defineEvents();
    }

    private defineEvents() {
        
        const dialog = this.getDialog();
        const colorDivs = [
            "green", "darkslateblue", "crimson", "lightcoral",
            "darkcyan", "aqua", "orange", "gray", "brown",
        ].map(c => dialog.querySelector(`.${c}.color-square`));


        for (const colorDiv of colorDivs) {
            colorDiv?.addEventListener("click", function(this : HTMLElement) {
                for (const colorDiv of colorDivs) 
                    colorDiv?.classList.remove("selected");
                
                this.classList.add("selected");
            });
        }

        const decks = ["deck-red", "deck-blue"]
            .map(c => dialog.querySelector(`.deck.${c}`));

        for (const deck of decks) {
            deck?.addEventListener("click", function(this : HTMLElement) {
                for (const deck of decks)
                    deck?.classList.remove("selected");

                this.classList.add("selected");
            });
        }
    }

    public getSelectedOptions(dialog : HTMLDialogElement) {
        const selectedItems = dialog.querySelectorAll(".selected");
        let result = new GameOptions();

        for (const item of selectedItems) {
            if (item.classList.contains("deck"))
                result.deck = [...item.classList].filter(i => i != "selected" && i != "deck")[0];

            if (item.classList.contains("color-square"))
                result.color = [...item.classList].filter(i => i != "selected" && i != "color-square")[0];
        }

        return result;
    } 
}