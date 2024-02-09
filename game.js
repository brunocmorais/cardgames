function getCards() {
    return dealCards(getOrderedCards());
}

function getColumns(cards) {
    const columns = new Array(8);
    let columnIndex = 0;

    for (const card of cards) {

        if (columns[columnIndex] === undefined)
            columns[columnIndex] = [];

        columns[columnIndex].push(card);
        columnIndex = (columnIndex + 1) % 8;
    }

    return columns;
}

function checkIfCardCanMove(card) {
    let index, column;

    for (column = 0; column < columns.length; column++) {
        index = columns[column].indexOf(card);

        if (index >= 0)
            break;
    }

    return index == columns[column].length - 1;
}

const cards = getCards();
const columns = getColumns(cards);
const freeCells = [...Array(4).keys()].map(_ => null);
const foundations = [...Array(4).keys()].map(_ => []);