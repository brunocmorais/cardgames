export class Column {
    
    #cards = [];

    getCard(index) {
        return this.#cards[index];
    }

    addCard(card) {
        this.#cards.push(card);
    }

    removeCard() {
        this.#cards.pop();
    }

    indexOf(card) {
        return this.#cards.indexOf(card);
    }

    size() {
        return this.#cards.length;
    }
}