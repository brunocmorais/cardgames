import { FreeCellGameContext } from "../../FreeCellGameContext";
import { FreeCellVariant } from "../../FreeCellVariant";

export class RelaxedFreeCellGameContext extends FreeCellGameContext {

    constructor() {
        super(FreeCellVariant.relaxed);
    }
}