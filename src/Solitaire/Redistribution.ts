import { Card } from "../Common/Model/Card";
import { Stack } from "../Common/Model/Stack";

export class Redistribution {

    public readonly stack : Stack<Card>;
    public readonly waste : Stack<Card>;

    constructor(dealedCards : Card[]) {
        this.stack = new Stack(dealedCards);
        this.waste = new Stack();
    }

    public dealCard() {
        const card = this.stack.pop();

        if (card) {
            this.waste.push(card);
        } else {
            let currentCard : Card | undefined;

            while (currentCard = this.waste.pop())
                this.stack.push(currentCard);
        }
    }

    public get top() {
        return this.waste.top;
    }
}