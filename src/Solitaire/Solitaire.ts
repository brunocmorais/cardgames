import { IGame } from "../Common/IGame";
import { Dealer } from "../Common/Model/Dealer";
import { Tableau } from "../Common/Model/Tableau";
import { DefaultFoundation } from "./DefaultFoundation";
import { DefaultTableau } from "./DefaultTableau";
import { Redistribution } from "./Redistribution";
import { Waste } from "./Waste";

export class Solitaire implements IGame {

    public readonly tableau : Tableau;
    public readonly foundation : DefaultFoundation;
    public readonly stack : Redistribution;
    public readonly waste : Waste;

    constructor(gameNumber : number) {

        const dealer = new Dealer(gameNumber);
        const cards = dealer.getOrderedCards();
        const dealedCards = dealer.dealCards(cards);

        this.tableau = new DefaultTableau(dealedCards, 7);
        this.foundation = new DefaultFoundation(4);
        this.stack = new Redistribution();
        this.waste = new Waste();
    }
}
