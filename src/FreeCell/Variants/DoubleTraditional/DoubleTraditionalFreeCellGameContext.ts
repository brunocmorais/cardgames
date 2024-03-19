import { FreeCellGameContext } from "../../FreeCellGameContext";
import { FreeCellVariant } from "../../FreeCellVariant";

export class DoubleTraditionalFreeCellGameContext extends FreeCellGameContext {

    constructor() {
        super(FreeCellVariant.doubleTraditional);
    }
}