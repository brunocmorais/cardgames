import { Dealer } from "../Common/Model/Dealer";
import { Tableau } from "../Common/Model/Tableau";
import { DefaultFoundation } from "../FreeCell/GameTypes/Default/DefaultFoundation";
import { DefaultTableau } from "./DefaultTableau";

export class Solitaire {

    public readonly tableau : Tableau;
    public readonly foundation : DefaultFoundation;

    constructor(gameNumber : number) {

        const dealer = new Dealer(gameNumber);
        const cards = dealer.getOrderedCards();
        const dealedCards = dealer.dealCards(cards);

        this.tableau = new DefaultTableau(dealedCards, 7);
        this.foundation = new DefaultFoundation(4);
    }
}

