import { Dealer } from "./Dealer";
import { FreeCells } from "./FreeCells";
import { Foundation } from "./Foundation";
import { Tableau } from "./Tableau";
import { Position } from "./Position";
import { cardNumbers } from "./Constants";
import { Card } from "./Card";
import { Column } from "./Column";
import { GameType } from "./GameType";

type GameParams = { 
    decks: number, 
    columns: number, 
    cells: number, 
    foundations: number,
    loop: boolean
};

export class FreeCell {

    public tableau;
    public cells;
    public foundation;

    constructor(gameNumber : number, gameType : GameType) {

        let sizes : GameParams;

        switch (gameType) {
            case GameType.default: sizes = { decks: 1, columns: 8, cells: 4, foundations: 4, loop: false }; break;
            case GameType.doubleTraditional: sizes = { decks: 2, columns: 10, cells: 8, foundations: 8, loop: false }; break;
            case GameType.doubleModern: sizes = { decks: 2, columns: 10, cells: 6, foundations: 4, loop: true }; break;
            default: throw new Error("Invalid game type!");
        }

        const dealer = new Dealer(gameNumber);
        let cards : Card[] = [];

        for (let i = 0; i < sizes.decks; i++)
            cards = [...cards, ...dealer.getOrderedCards()];

        const dealedCards = dealer.dealCards(cards);

        this.tableau = new Tableau(dealedCards, sizes.columns);
        this.cells = new FreeCells(sizes.cells);
        this.foundation = new Foundation(sizes.foundations, sizes.loop);
    }
    
    public checkIfCardCanStartMoving(card : Card) {
    
        if (this.cells.indexOf(card) >= 0 ||
            this.foundation.indexOf(card) >= 0)
            return true;

        const column = this.tableau.getCardColumn(card);

        if (!column)
            return false;
        
        if (!this.numberOfCardsIsValid(card, column))
            return false;

        let evaluatingCard = card;
        let expectedNumber = cardNumbers[cardNumbers.indexOf(evaluatingCard.number) - 1];

        for (const cardBelow of column.getCardsBelow(card)) {
            
            if (cardBelow.number != expectedNumber || cardBelow.isRed === evaluatingCard.isRed)
                return false;

            evaluatingCard = cardBelow;
            expectedNumber = cardNumbers[cardNumbers.indexOf(evaluatingCard.number) - 1];
        }

        return true;
    }

    private numberOfCardsIsValid(card : Card, currentColumn : Column, destinationColumn : Column | undefined = undefined) {
        const cardIndexOnColumn = currentColumn.indexOf(card);
        const columnSize = currentColumn.length;

        const freeCellCount = this.cells.getEmptyCellCount();
        let emptyColumnCount = this.tableau.getEmptyColumnCount();

        if (destinationColumn?.length == 0)
            emptyColumnCount--;

        if (columnSize - 1 - cardIndexOnColumn >= (freeCellCount + 1) * (emptyColumnCount + 1))
            return false;

        return true;
    }

    private getCardOrigin(card : Card) {
        if (this.cells.indexOf(card) >= 0)
            return [Position.freeCells, this.cells.indexOf(card)];
        else if (this.foundation.indexOf(card) >= 0)
            return [Position.foundation, this.foundation.indexOf(card)];
        else
            return [Position.columnWithCard, this.tableau.indexOfCard(card)];
    }

    private removeCardFromOrigin(origin : Position, index : number) {

        switch (origin) {
            case Position.columnWithCard:
                this.tableau.getColumn(index).remove();
                break;
            case Position.freeCells:
                this.cells.set(index, null);
                break;
            case Position.foundation:
                this.foundation.get(index).pop();
                break;

        }
    }

    public tryToMoveCardTo(destination : Position, cards : Card[], index : number) {
        const multiCard = cards.length > 1;

        switch (destination) {
            case Position.freeCells:
                if (!multiCard) 
                    return this.tryToMoveCardToFreeCell(cards[0], index);
            case Position.foundation:
                if (!multiCard)
                    return this.tryToMoveCardToFoundation(cards[0], index);
            case Position.columnWithCard:
                return this.tryToMoveCardsToColumn(cards, index);
            case Position.columnWithoutCard:
                return this.tryToMoveCardsToColumn(cards, index);
        }
    }
    
    private tryToMoveCardToFreeCell(card : Card, index : number) {

        const [ origin, indexOrigin ] = this.getCardOrigin(card);

        const column = this.tableau.getColumn(indexOrigin);

        if (column.attemptToMoveDeepCard(card, origin))
            return false;

        const result = this.cells.set(index, card);

        if (result)
            this.removeCardFromOrigin(origin, indexOrigin);

        return result;
    }

    private tryToMoveCardToFoundation(card : Card, foundationIndex : number) {

        const [origin, indexOrigin] = this.getCardOrigin(card);

        if (origin === Position.foundation)
            return false;

        const column = this.tableau.getColumn(indexOrigin);

        if (column.attemptToMoveDeepCard(card, origin))
            return false;

        const result = this.foundation.push(foundationIndex, card);
        
        if (result)
            this.removeCardFromOrigin(origin, indexOrigin);

        return result;
    }

    private tryToMoveCardsToColumn(cards : Card[], columnIndex : number) {

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
            column.add(cards[i]);
            this.removeCardFromOrigin(origin, indexOrigin);
        }

        return true;
    }

    public tryToMoveCardToSomewhere(card : Card) {
        
        const [ position ] = this.getCardOrigin(card);

        if (position !== Position.foundation)
            for (let i = 0; i < this.foundation.length; i++)
                if (this.tryToMoveCardToFoundation(card, i))
                    return true;

        if (position === Position.columnWithCard || position === Position.columnWithoutCard) {
            const column = this.tableau.getCardColumn(card) as Column;
            const cardIndex = column.indexOf(card);
            const cards = [ card ];
            
            for (let i = cardIndex + 1; i < column.length; i++)
                cards.push(column.getCard(i));
        
            const columnIndex = this.tableau.indexOf(column);

            for (let i = 0; i < this.tableau.length; i++) {
                const c = this.tableau.getColumn(i);

                if (i === columnIndex || c.length === 0)
                    continue;

                if (this.tryToMoveCardsToColumn(cards, i))
                    return true;
            }
        } else {
            for (let i = 0; i < this.tableau.length; i++)
                if (this.tryToMoveCardsToColumn([card], i))
                    return true;
        }

        if (position !== Position.freeCells)
            for (let i = 0; i < this.cells.length; i++)
                if (this.tryToMoveCardToFreeCell(card, i))
                    return true;

        return false;
    }
}