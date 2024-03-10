import { IGame } from "../Common/IGame";
import { Card } from "../Common/Model/Card";
import { Column } from "../Common/Model/Column";
import { cardNumbers } from "../Common/Model/Constants";
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
            return [ Position.stack, 0 ];

        if (this.redistribution.waste.indexOf(card) >= 0)
            return [ Position.waste, 0 ];

        const foundationIndex = this.foundation.indexOf(card);
        
        if (foundationIndex >= 0)
            return [ Position.foundation, foundationIndex ];

        return [ Position.tableau, this.tableau.indexOfCard(card) ];
    }

    protected removeCardFromOrigin(origin : Position, index : number) {

        switch (origin) {
            case Position.tableau:
                this.tableau.getColumn(index).remove();
                break;
            case Position.waste:
                this.redistribution.waste.pop();
                break;
            case Position.foundation:
                this.foundation.get(index).pop();
                break;
        }
    }

    public tryToMoveCardTo(destination : Position, cards : Card[], index : number) {
        const multiCard = cards.length > 1;

        switch (destination) {
            case Position.foundation:
                if (!multiCard)
                    return this.tryToMoveCardToFoundation(cards[0], index);
            case Position.tableau:
                return this.tryToMoveCardsToColumn(cards, index);
        }
    }

    protected tryToMoveCardsToColumn(cards : Card[], columnIndex : number) {

        const higherCard = cards[0];
        const column = this.tableau.getColumn(columnIndex);

        if (column.length > 0) {
            const lastCardInColumn = column.getCard(column.length - 1);
            const expectedNumber = cardNumbers[cardNumbers.indexOf(higherCard.number) + 1];
            
            if (expectedNumber != lastCardInColumn.number || lastCardInColumn.isRed === higherCard.isRed)
                return false;
        } else {
            if (higherCard.number != 'K')
                return false;
        }

        const [origin, indexOrigin] = this.getCardPosition(higherCard);

        for (let i = 0; i < cards.length; i++) {
            column.add(cards[i]);
            this.removeCardFromOrigin(origin, indexOrigin);
        }

        return true;
    }

    protected tryToMoveCardToFoundation(card : Card, foundationIndex : number) {

        const [origin, indexOrigin] = this.getCardPosition(card);

        if (origin === Position.stack)
            return false;

        const column = this.tableau.getColumn(indexOrigin);

        if (column.isDeepCard(card))
            return false;

        const result = this.foundation.push(foundationIndex, card);
        
        if (result)
            this.removeCardFromOrigin(origin, indexOrigin);

        return result;
    }

    public tryToMoveCardToSomewhere(card : Card) {
        
        const [ position ] = this.getCardPosition(card);

        if (position !== Position.foundation)
            for (let i = 0; i < this.foundation.length; i++)
                if (this.tryToMoveCardToFoundation(card, i))
                    return true;

        if (position === Position.tableau) {
            const column = this.tableau.getCardColumn(card) as Column;
            const cardIndex = column.indexOf(card);
            const cards = [ card ];
            
            for (let i = cardIndex + 1; i < column.length; i++)
                cards.push(column.getCard(i));
        
            const columnIndex = this.tableau.indexOf(column);

            let orderedColumns = this.tableau.getColumns().orderByDesc(x => x.length);

            if (cardIndex === 0)
                orderedColumns = orderedColumns.filter(x => x.length > 0);

            for (const column of orderedColumns) {
                const index = this.tableau.indexOf(column);

                if (index === columnIndex)
                    continue;

                if (this.tryToMoveCardsToColumn(cards, index))
                    return true;
            }
        } else {
            for (let i = 0; i < this.tableau.length; i++)
                if (this.tryToMoveCardsToColumn([card], i))
                    return true;
        }

        return false;
    }

    public flipCard(card : Card) {

        if (!card.flipped)
            return;

        const column = this.tableau.getCardColumn(card);

        if (!column)
            return;

        const index = column.indexOf(card);

        if (index === column.length - 1)
            card.flipped = false;
    }
}