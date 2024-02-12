import { cardNumbers } from "./constants.js";
import { range } from "./util.js";

export class Foundations {
    #foundations = range(4).map(_ => []);

    get(index) {
        return this.#foundations[index];
    }

    push(index, card) {
        if (!this.#validate(this.#foundations[index], card))
            return false;

        this.#foundations[index].push(card);
        return true;
    }

    pop(index) {
        this.#foundations[index].pop();
    }

    indexOf(card) {
        for (const [index, foundation] of this.#foundations.entries())
            if (foundation.indexOf(card) >= 0)
                return index;
    }

    #validate(foundation, card) {
        if (foundation.length === 0)
            return card.number == 'A';
            
        const topCard = foundation[foundation.length - 1];
        return card.suit == topCard.suit && (cardNumbers.indexOf(card.number) - cardNumbers.indexOf(topCard.number)) == 1;
    }
}
