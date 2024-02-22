import { IGame } from "../Common/IGame";
import { Card } from "../Common/Model/Card";
import { Dealer } from "../Common/Model/Dealer";
import { Tableau } from "../Common/Model/Tableau";
import { DefaultFoundation } from "./DefaultFoundation";
import { DefaultTableau } from "./DefaultTableau";
import { Position } from "./Position";
import { Redistribution } from "./Redistribution";

export class Solitaire implements IGame {

    public readonly tableau : Tableau;
    public readonly foundation : DefaultFoundation;
    public readonly redistribution : Redistribution;    

    constructor(gameNumber : number) {

        const dealer = new Dealer(gameNumber);
        const cards = dealer.getOrderedCards();
        const dealedCards = dealer.dealCards(cards);

        this.tableau = new DefaultTableau(dealedCards, 7);
        this.foundation = new DefaultFoundation(4);
        this.redistribution = new Redistribution(dealedCards);
    }

    public dealCard() {
        this.redistribution.dealCard();
    }

    public getCardPosition(card : Card) {

        if (this.redistribution.stack.indexOf(card) >= 0)
            return Position.stack;

        if (this.redistribution.waste.indexOf(card) >= 0)
            return Position.waste;

        if (this.foundation.indexOf(card) >= 0)
            return Position.foundation;

        return Position.tableau;
    }
}