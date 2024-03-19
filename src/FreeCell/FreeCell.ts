import { Dealer } from "../Common/Model/Dealer";
import { Cells } from "./Cells";
import { Position } from "./Position";
import { cardNumbers } from "../Common/Model/Constants";
import { Card } from "../Common/Model/Card";
import { Column } from "../Common/Model/Column";
import { FreeCellOptions } from "./FreeCellOptions";
import { Foundation } from "../Common/Model/Foundation";
import { DefaultTableau } from "./Variants/Default/DefaultTableau";
import { IGame } from "../Common/IGame";

export abstract class FreeCell implements IGame {

    public readonly tableau;
    public readonly cells;
    public readonly foundation;
    public readonly gameNumber: number;

    constructor(gameNumber : number, sizes : FreeCellOptions, foundation: Foundation) {

        this.gameNumber = gameNumber;
        
        const dealer = new Dealer(gameNumber);
        let cards : Card[] = [];

        for (let i = 0; i < sizes.decks; i++)
            cards = [...cards, ...dealer.getOrderedCards()];

        const dealedCards = dealer.dealCards(cards);

        this.tableau = new DefaultTableau(dealedCards, sizes.columns);
        this.cells = new Cells(sizes.cells);
        this.foundation = foundation;
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

    protected numberOfCardsIsValid(card : Card, currentColumn : Column) {
        const cardIndexOnColumn = currentColumn.indexOf(card);
        const columnSize = currentColumn.length;

        const freeCellCount = this.cells.getEmptyCellCount();

        if (columnSize - 1 - cardIndexOnColumn >= (freeCellCount + 1))
            return false;

        return true;
    }

    protected getCardOrigin(card : Card) {
        if (this.cells.indexOf(card) >= 0)
            return [Position.freeCells, this.cells.indexOf(card)];
        else if (this.foundation.indexOf(card) >= 0)
            return [Position.foundation, this.foundation.indexOf(card)];
        else
            return [Position.columnWithCard, this.tableau.indexOfCard(card)];
    }

    protected removeCardFromOrigin(origin : Position, index : number) {

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
            case Position.columnWithoutCard:
                return this.tryToMoveCardsToColumn(cards, index);
        }
    }
    
    protected tryToMoveCardToFreeCell(card : Card, index : number) {

        const [ origin, indexOrigin ] = this.getCardOrigin(card);

        const column = this.tableau.getColumn(indexOrigin);

        if (column.isDeepCard(card))
            return false;

        const result = this.cells.set(index, card);

        if (result)
            this.removeCardFromOrigin(origin, indexOrigin);

        return result;
    }

    protected tryToMoveCardToFoundation(card : Card, foundationIndex : number) {

        const [origin, indexOrigin] = this.getCardOrigin(card);

        if (origin === Position.foundation)
            return false;

        const column = this.tableau.getColumn(indexOrigin);

        if (column.isDeepCard(card))
            return false;

        const result = this.foundation.push(foundationIndex, card);
        
        if (result)
            this.removeCardFromOrigin(origin, indexOrigin);

        return result;
    }

    protected tryToMoveCardsToColumn(cards : Card[], columnIndex : number) {

        const higherCard = cards[0];
        const column = this.tableau.getColumn(columnIndex);

        if (column.length > 0) {
            const lastCardInColumn = column.getCard(column.length - 1);
            const expectedNumber = cardNumbers[cardNumbers.indexOf(higherCard.number) + 1];
            
            if (expectedNumber != lastCardInColumn.number || lastCardInColumn.isRed === higherCard.isRed)
                return false;
        }

        const originColumn = this.tableau.getCardColumn(higherCard);
        
        if (originColumn && !this.numberOfCardsIsValid(higherCard, originColumn))
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

        if (position !== Position.freeCells)
            for (let i = 0; i < this.cells.length; i++)
                if (this.tryToMoveCardToFreeCell(card, i))
                    return true;

        return false;
    }
}