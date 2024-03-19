import { FreeCellGameContext } from "../FreeCell/FreeCellGameContext";
import { DoubleModernFreeCellGameContext } from "../FreeCell/Variants/DoubleModern/DoubleModernFreeCellGameContext";
import { DoubleTraditionalFreeCellGameContext } from "../FreeCell/Variants/DoubleTraditional/DoubleTraditionalFreeCellGameContext";
import { RelaxedFreeCellGameContext } from "../FreeCell/Variants/Relaxed/RelaxedFreeCellGameContext";
import { SolitaireGameContext } from "../Solitaire/SolitaireGameContext";

export class GameContextFactory {

    public static get(name : string) {
        switch (name) {
            case "freecell": return new FreeCellGameContext();
            case "doublefreecell": return new DoubleTraditionalFreeCellGameContext();
            case "doublemodernfreecell": return new DoubleModernFreeCellGameContext();
            case "relaxedfreecell": return new RelaxedFreeCellGameContext();
            case "solitaire": return new SolitaireGameContext();
            default: throw new Error("Jogo desconhecido!");
        }
    }
}