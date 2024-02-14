import { Dealer } from "./Dealer.js";
import { FreeCells } from "./FreeCells.js";
import { Foundations } from "./Foundations.js";
import { Tableau } from "./Tableau.js";
import { Positions } from "./Positions.js";
import { cardNumbers } from "./Constants.js";
import { Card } from "./Card.js";
import { Column } from "./Column.js";

export class FreeCell {

    public cards;
    public tableau;
    public freeCells;
    public foundations;

    constructor(gameNumber : number) {
        const dealer = new Dealer(gameNumber);
        this.cards = dealer.dealCards();
        this.tableau = new Tableau(this.cards);
        this.freeCells = new FreeCells();
        this.foundations = new Foundations();
    }
    
    checkIfCardCanStartMoving(card : Card) {
    
        if (this.freeCells.indexOf(card) >= 0 ||
            this.foundations.indexOf(card) >= 0)
            return true;

        const column = this.tableau.getCardColumn(card);

        if (!column)
            return false;

        const cardIndexOnColumn = column.indexOf(card);
        const columnSize = column.length;

        const freeCellCount = this.freeCells.getEmptyCellCount();
        const emptyColumnCount = this.tableau.getEmptyColumnCount();

        if (columnSize - 1 - cardIndexOnColumn >= (freeCellCount + 1) * (emptyColumnCount + 1))
            return false;

        let evaluatingCard = card;
        let expectedNumber = cardNumbers[cardNumbers.indexOf(evaluatingCard.number) - 1];

        for (let i = cardIndexOnColumn + 1; i < columnSize; i++) {
            const cardBelow = column.getCard(i);
            
            if (cardBelow.number != expectedNumber || cardBelow.isRed === evaluatingCard.isRed)
                return false;

            evaluatingCard = cardBelow;
            expectedNumber = cardNumbers[cardNumbers.indexOf(evaluatingCard.number) - 1];
        }

        return true;
    }

    getCardOrigin(card : Card) {
        if (this.freeCells.indexOf(card) >= 0)
            return [Positions.freeCells, this.freeCells.indexOf(card)];
        else if (this.foundations.indexOf(card) >= 0)
            return [Positions.foundation, this.foundations.indexOf(card)];
        else
            return [Positions.columnWithCard, this.tableau.indexOfCard(card)];
    }

    removeCardFromOrigin(origin : Positions, index : number) {

        switch (origin) {
            case Positions.columnWithCard:
                this.tableau.getColumn(index).remove();
                break;
            case Positions.freeCells:
                this.freeCells.set(index, null);
                break;
            case Positions.foundation:
                this.foundations.get(index).pop();
                break;

        }
    }

    private attemptToMoveDeepCard(card : Card, origin : Positions, indexOrigin : number) {
        if (origin === Positions.columnWithCard || origin === Positions.columnWithoutCard) {
            const column = this.tableau.getColumn(indexOrigin);

            if (column.indexOf(card) != column.length - 1)
                return true;
        }

        return false;
    }

    public tryToMoveCardTo(destination : Positions, cards : Card[], index : number) {
        const multiCard = cards.length > 1;

        switch (destination) {
            case Positions.freeCells:
                if (!multiCard) 
                    this.tryToMoveCardToFreeCell(cards[0], index);
                break;
            case Positions.foundation:
                if (!multiCard)
                    this.tryToMoveCardToFoundation(cards[0], index);
                break;
            case Positions.columnWithCard:
                this.tryToMoveCardsToColumn(cards, index);
                break;
            case Positions.columnWithoutCard:
                this.tryToMoveCardsToColumn(cards, index);
                break;
        }
    }
    
    tryToMoveCardToFreeCell(card : Card, index : number) {

        const [ origin, indexOrigin ] = this.getCardOrigin(card);

        if (this.attemptToMoveDeepCard(card, origin, indexOrigin))
            return false;

        const result = this.freeCells.set(index, card);

        if (result)
            this.removeCardFromOrigin(origin, indexOrigin);

        return result;
    }

    tryToMoveCardToFoundation(card : Card, foundationIndex : number) {

        const [origin, indexOrigin] = this.getCardOrigin(card);

        if (origin === Positions.foundation)
            return false;

        if (this.attemptToMoveDeepCard(card, origin, indexOrigin))
            return false;

        const result = this.foundations.push(foundationIndex, card);
        
        if (result)
            this.removeCardFromOrigin(origin, indexOrigin);

        return result;
    }

    tryToMoveCardsToColumn(cards : Card[], columnIndex : number) {

        const higherCard = cards[0];
        const column = this.tableau.getColumn(columnIndex);

        if (column.length > 0) {
            const lastCardInColumn = column.getCard(column.length - 1);
            const expectedNumber = cardNumbers[cardNumbers.indexOf(higherCard.number) + 1];
            
            if (expectedNumber != lastCardInColumn.number || lastCardInColumn.isRed === higherCard.isRed)
                return false;
        }

        const [origin, indexOrigin] = this.getCardOrigin(higherCard);

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            column.add(card);
            this.removeCardFromOrigin(origin, indexOrigin);
        }

        return true;
    }

    tryToMoveCardToWithoutDestination(card : Card) {

        for (let i = 0; i < 4; i++)
            if (this.tryToMoveCardToFoundation(card, i))
                return true;
        
        const [ position ] = this.getCardOrigin(card);

        if (position === Positions.columnWithCard || position === Positions.columnWithoutCard) {
            const column = this.tableau.getCardColumn(card) as Column;
            const cardIndex = column.indexOf(card);
            const cards = [ card ];
            
            for (let i = cardIndex + 1; i < column.length; i++)
                cards.push(column.getCard(i));
        
            const columnIndex = this.tableau.indexOf(column);

            for (let i = 0; i < 8; i++) {
                if (i === columnIndex)
                    continue;

                if (this.tryToMoveCardsToColumn(cards, i))
                    return true;
            }
        } else {
            for (let i = 0; i < 8; i++)
                if (this.tryToMoveCardsToColumn([card], i))
                    return true;
        }

        for (let i = 0; i < 4; i++)
            if (this.tryToMoveCardToFreeCell(card, i))
                return true;

        return false;
    }
}