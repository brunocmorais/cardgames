import { DialogButtons } from "./DialogButtons";

export class Dialog {

    constructor(content : string, title : string, buttons : DialogButtons, onClose? : (dialog : HTMLDialogElement, result : boolean) => void) {

        const dialog = this.getDialog();
        const dialogHeader = this.getTitle(dialog);
        const dialogBody = this.getBody(dialog);
        
        dialogHeader.innerText = title;
        dialogBody.innerHTML = content;
        
        this.createButtons(buttons, onClose);
    }

    protected getDialog() {
        return document.querySelector("body > .dialog") as HTMLDialogElement;
    }

    protected getTitle(dialog : HTMLDialogElement) {
        return dialog.querySelector(".dialog-title") as HTMLSpanElement;
    }

    protected getBody(dialog : HTMLDialogElement) {
        return dialog.querySelector(".dialog-body") as HTMLDivElement;
    }

    protected getFooter(dialog : HTMLDialogElement) {
        return dialog.querySelector(".dialog-footer") as HTMLDivElement;
    }

    protected createButton(text : string) {
        const button = document.createElement("button");
        button.className = "button dialog-button";
        button.innerText = text;
        return button;
    }

    protected createButtons(buttons : DialogButtons, onClose? : (dialog : HTMLDialogElement, result : boolean) => void) {

        const dialog = this.getDialog();
        const footer = this.getFooter(dialog);
        let positive! : HTMLButtonElement;
        let negative! : HTMLButtonElement;

        switch (buttons) {
            case DialogButtons.OkCancel:
                positive = this.createButton("OK");
                negative = this.createButton("Cancelar");
                break;
            case DialogButtons.Ok:
                positive = this.createButton("OK");
                break;
            case DialogButtons.YesNo:
                positive = this.createButton("Sim");
                negative = this.createButton("Não");
                break;
            case DialogButtons.None:
                break;
        }

        const children : HTMLButtonElement[] = [];

        if (positive) {
            positive.onclick = () => {
                if (onClose)
                    onClose(dialog, true);

                dialog.close();
            };
    
            children.push(positive);
        }

        if (negative) {
            negative.onclick = () => {
                if (onClose)
                    onClose(dialog, false);

                dialog.close();
            };
            
            children.push(negative);
        }

        footer.replaceChildren(...children);
        const close = dialog.querySelector(".dialog-close") as HTMLDivElement;

        if (!close.onclick) {
            close.onclick = () => {
                if (onClose)
                    onClose(dialog, false);
                
                dialog.close();
            };
        }        
    }

    public showDialog() {
        const dialog = this.getDialog();
        dialog.showModal();
    }
}