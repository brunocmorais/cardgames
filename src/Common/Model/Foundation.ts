import { Card } from "./Card";
import { range } from "../../Util/Functions";

export abstract class Foundation {
    protected foundation : Card[][];

    constructor(foundationCount : number) {
        this.foundation = range(foundationCount).map(_ => []);
    }

    abstract validate(foundation : Card[], card : Card) : boolean;

    get(index : number) {
        return this.foundation[index];
    }

    push(index : number, card : Card) {
        if (!this.validate(this.foundation[index], card))
            return false;

        this.foundation[index].push(card);
        return true;
    }

    indexOf(card : Card) {
        for (const [index, foundation] of this.foundation.entries())
            if (foundation.indexOf(card) >= 0)
                return index;

        return -1;
    }
    
    get length() {
        return this.foundation.length;
    }
}
