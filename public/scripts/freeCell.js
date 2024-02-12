import { Dealer } from "./dealer.js";
import { FreeCells } from "./freeCells.js";
import { Foundations } from "./foundations.js";
import { Tableau } from "./tableau.js";
import { Positions } from "./positions.js";
import { cardNumbers } from "./constants.js";

export class FreeCell {

    constructor() {
        this.cards = new Dealer().dealCards();
        this.tableau = new Tableau(this.cards);
        this.freeCells = new FreeCells();
        this.foundations = new Foundations();
    }
    
    checkIfCardCanStartMoving(card) {
    
        if (this.freeCells.indexOf(card) >= 0 ||
            this.foundations.indexOf(card) >= 0)
            return true;

        const column = this.tableau.getCardColumn(card);
        const cardIndexOnColumn = column.indexOf(card);
        const columnSize = column.size();

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

    getCardOrigin(card) {
        if (this.freeCells.indexOf(card) >= 0)
            return [Positions.freeCells, this.freeCells.indexOf(card)];
        else if (this.foundations.indexOf(card) >= 0)
            return [Positions.foundation, this.foundations.indexOf(card)];
        else
            return [Positions.columnWithCard, this.tableau.indexOf(card)];
    }

    removeCardFromOrigin(origin, index) {

        switch (origin) {
            case Positions.columnWithCard:
                this.tableau.getColumn(index).removeCard();
                break;
            case Positions.freeCells:
                this.freeCells.set(index, null);
                break;
            case Positions.foundation:
                this.foundations.get(index).pop();
                break;

        }
    }
    
    tryToMoveCardToFreeCell(card, index) {

        const [origin, indexOrigin] = this.getCardOrigin(card);
        const result = this.freeCells.set(index, card);

        if (result)
            this.removeCardFromOrigin(origin, indexOrigin);

        return result;
    }

    tryToMoveCardToFoundation(card, foundationIndex) {

        const [origin, indexOrigin] = this.getCardOrigin(card);
        const result = this.foundations.push(foundationIndex, card);
        
        if (result)
            this.removeCardFromOrigin(origin, indexOrigin);

        return result;
    }

    tryToMoveCardsToColumn(cards, columnIndex) {

        const higherCard = cards[0];
        const column = this.tableau.getColumn(columnIndex);

        if (column.size() > 0) {
            const lastCardInColumn = column.getCard(column.size() - 1);
            const expectedNumber = cardNumbers[cardNumbers.indexOf(higherCard.number) + 1];
            
            if (expectedNumber != lastCardInColumn.number || lastCardInColumn.isRed === higherCard.isRed)
                return false;
        }

        const [origin, indexOrigin] = this.getCardOrigin(higherCard);

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            column.addCard(card);
            this.removeCardFromOrigin(origin, indexOrigin);
        }

        return true;
    }

    checkIfGameIsFinished() {
        for (let i = 0; i < 4; i++) {
            const foundation = this.foundations.get(i);

            if (foundation.length != 13)
                return false;
        }

        return true;
    }
}