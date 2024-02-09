let rngState = 1;

function dealCards(cards) {
    let deal = [];

    while (cards.length > 0) {
        const index = rng() % cards.length;
        const lastIndex = cards.length - 1;

        const cardA = cards[index];
        const cardB = cards[lastIndex];

        cards[index] = cardB;
        cards[lastIndex] = cardA;

        deal.push(cards.pop());
    }

    return deal;
} 

function rng() {
    rngState = (214013 * rngState + 2531011) % Math.pow(2, 31);
    return rngState >> 16;
}

function getOrderedCards() {
    const cardNumbers = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
    const suits = ['C', 'D', 'H', 'S'];

    let cards = [];
    
    for (let i = 0; i < cardNumbers.length; i++) {
        for (let j = 0; j < suits.length; j++) {
            const card = {
                value: cardNumbers[i] + suits[j],
                suit: suits[j],
                number: cardNumbers[i],
                isBlack: ['C', 'S'].indexOf(suits[j]) >= 0,
                isRed: ['D', 'H'].indexOf(suits[j]) >= 0
            };

            cards.push(card);
        }
    }

    return cards;
}