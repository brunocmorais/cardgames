import { FreeCellGameContext } from "../../FreeCellGameContext";
import { FreeCellVariant } from "../../FreeCellVariant";

export class DoubleModernFreeCellGameContext extends FreeCellGameContext {

    constructor() {
        super(FreeCellVariant.doubleModern);
    }
}