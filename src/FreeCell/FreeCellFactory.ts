import { FreeCellVariant } from "./FreeCellVariant";
import { FreeCell } from "./FreeCell";
import { DefaultFreeCell } from "./Variants/Default/DefaultFreeCell";
import { AbstractFactory } from "../Util/AbstractFactory";
import { DoubleModernFreeCell } from "./Variants/DoubleModern/DoubleModernFreeCell";
import { DoubleTraditionalFreeCell } from "./Variants/DoubleTraditional/DoubleTraditionalFreeCell";
import { RelaxedFreeCell } from "./Variants/Relaxed/RelaxedFreeCell";

export class FreeCellFactory extends AbstractFactory<FreeCellVariant, FreeCell> {

    public override get(variant: FreeCellVariant, params: any[]) {

        const gameNumber = params[0] as number;

        switch (variant) {
            case FreeCellVariant.default: return new DefaultFreeCell(gameNumber);
            case FreeCellVariant.doubleModern: return new DoubleModernFreeCell(gameNumber);
            case FreeCellVariant.doubleTraditional: return new DoubleTraditionalFreeCell(gameNumber);
            case FreeCellVariant.relaxed: return new RelaxedFreeCell(gameNumber);
            default: throw new Error("Variant not implemented!");
        }
    }
}
