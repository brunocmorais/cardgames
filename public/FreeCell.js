import { Dealer } from "./Dealer.js";
import { FreeCells } from "./FreeCells.js";
import { Foundations } from "./Foundations.js";
import { Tableau } from "./Tableau.js";
import { Positions } from "./Positions.js";
import { cardNumbers } from "./Constants.js";
export class FreeCell {
    cards;
    tableau;
    freeCells;
    foundations;
    constructor(gameNumber) {
        const dealer = new Dealer(gameNumber);
        this.cards = dealer.dealCards();
        this.tableau = new Tableau(this.cards);
        this.freeCells = new FreeCells();
        this.foundations = new Foundations();
    }
    checkIfCardCanStartMoving(card) {
        if (this.freeCells.indexOf(card) >= 0 ||
            this.foundations.indexOf(card) >= 0)
            return true;
        const column = this.tableau.getCardColumn(card);
        if (!column)
            return false;
        const cardIndexOnColumn = column.indexOf(card);
        if (!this.numberOfCardsIsValid(card, column))
            return false;
        let evaluatingCard = card;
        let expectedNumber = cardNumbers[cardNumbers.indexOf(evaluatingCard.number) - 1];
        for (let i = cardIndexOnColumn + 1; i < column.length; i++) {
            const cardBelow = column.getCard(i);
            if (cardBelow.number != expectedNumber || cardBelow.isRed === evaluatingCard.isRed)
                return false;
            evaluatingCard = cardBelow;
            expectedNumber = cardNumbers[cardNumbers.indexOf(evaluatingCard.number) - 1];
        }
        return true;
    }
    numberOfCardsIsValid(card, currentColumn, destinationColumn = undefined) {
        const cardIndexOnColumn = currentColumn.indexOf(card);
        const columnSize = currentColumn.length;
        const freeCellCount = this.freeCells.getEmptyCellCount();
        let emptyColumnCount = this.tableau.getEmptyColumnCount();
        if (destinationColumn?.length == 0)
            emptyColumnCount--;
        if (columnSize - 1 - cardIndexOnColumn >= (freeCellCount + 1) * (emptyColumnCount + 1))
            return false;
        return true;
    }
    getCardOrigin(card) {
        if (this.freeCells.indexOf(card) >= 0)
            return [Positions.freeCells, this.freeCells.indexOf(card)];
        else if (this.foundations.indexOf(card) >= 0)
            return [Positions.foundation, this.foundations.indexOf(card)];
        else
            return [Positions.columnWithCard, this.tableau.indexOfCard(card)];
    }
    removeCardFromOrigin(origin, index) {
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
    attemptToMoveDeepCard(card, origin, indexOrigin) {
        if (origin === Positions.columnWithCard || origin === Positions.columnWithoutCard) {
            const column = this.tableau.getColumn(indexOrigin);
            if (column.indexOf(card) != column.length - 1)
                return true;
        }
        return false;
    }
    tryToMoveCardTo(destination, cards, index) {
        const multiCard = cards.length > 1;
        switch (destination) {
            case Positions.freeCells:
                if (!multiCard)
                    return this.tryToMoveCardToFreeCell(cards[0], index);
            case Positions.foundation:
                if (!multiCard)
                    return this.tryToMoveCardToFoundation(cards[0], index);
            case Positions.columnWithCard:
                return this.tryToMoveCardsToColumn(cards, index);
            case Positions.columnWithoutCard:
                return this.tryToMoveCardsToColumn(cards, index);
        }
        return false;
    }
    tryToMoveCardToFreeCell(card, index) {
        const [origin, indexOrigin] = this.getCardOrigin(card);
        if (this.attemptToMoveDeepCard(card, origin, indexOrigin))
            return false;
        const result = this.freeCells.set(index, card);
        if (result)
            this.removeCardFromOrigin(origin, indexOrigin);
        return result;
    }
    tryToMoveCardToFoundation(card, foundationIndex) {
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
    tryToMoveCardsToColumn(cards, columnIndex) {
        const higherCard = cards[0];
        const column = this.tableau.getColumn(columnIndex);
        if (column.length > 0) {
            const lastCardInColumn = column.getCard(column.length - 1);
            const expectedNumber = cardNumbers[cardNumbers.indexOf(higherCard.number) + 1];
            if (expectedNumber != lastCardInColumn.number || lastCardInColumn.isRed === higherCard.isRed)
                return false;
        }
        const originColumn = this.tableau.getCardColumn(higherCard);
        if (originColumn && !this.numberOfCardsIsValid(higherCard, originColumn, column))
            return false;
        const [origin, indexOrigin] = this.getCardOrigin(higherCard);
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            column.add(card);
            this.removeCardFromOrigin(origin, indexOrigin);
        }
        return true;
    }
    tryToMoveCardToWithoutDestination(card) {
        const [position] = this.getCardOrigin(card);
        if (position !== Positions.foundation)
            for (let i = 0; i < 4; i++)
                if (this.tryToMoveCardToFoundation(card, i))
                    return true;
        if (position === Positions.columnWithCard || position === Positions.columnWithoutCard) {
            const column = this.tableau.getCardColumn(card);
            const cardIndex = column.indexOf(card);
            const cards = [card];
            for (let i = cardIndex + 1; i < column.length; i++)
                cards.push(column.getCard(i));
            const columnIndex = this.tableau.indexOf(column);
            for (let i = 0; i < 8; i++) {
                if (i === columnIndex)
                    continue;
                if (this.tryToMoveCardsToColumn(cards, i))
                    return true;
            }
        }
        else {
            for (let i = 0; i < 8; i++)
                if (this.tryToMoveCardsToColumn([card], i))
                    return true;
        }
        if (position !== Positions.freeCells)
            for (let i = 0; i < 4; i++)
                if (this.tryToMoveCardToFreeCell(card, i))
                    return true;
        return false;
    }
}
