import { GameType } from "./FreeCellGameType";
import { FreeCell } from "./FreeCell";
import { DefaultFreeCell } from "./Default/DefaultFreeCell";
import { AbstractFactory } from "../../Util/AbstractFactory";
import { DoubleModernFreeCell } from "./DoubleModern/DoubleModernFreeCell";
import { DoubleTraditionalFreeCell } from "./DoubleTraditional/DoubleTraditionalFreeCell";
import { RelaxedFreeCell } from "./Relaxed/RelaxedFreeCell";

export class FreeCellFactory extends AbstractFactory<GameType, FreeCell> {

    public override get(type: GameType, params: any[]) {

        const gameNumber = params[0] as number;

        switch (type) {
            case GameType.default: return new DefaultFreeCell(gameNumber);
            case GameType.doubleModern: return new DoubleModernFreeCell(gameNumber);
            case GameType.doubleTraditional: return new DoubleTraditionalFreeCell(gameNumber);
            case GameType.relaxed: return new RelaxedFreeCell(gameNumber);
            default: throw new Error("Variant not implemented!");
        }
    }
}
