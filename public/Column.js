export class Column {
    cards = [];
    getCard(index) {
        return this.cards[index];
    }
    add(card) {
        this.cards.push(card);
    }
    remove() {
        this.cards.pop();
    }
    indexOf(card) {
        return this.cards.indexOf(card);
    }
    get length() {
        return this.cards.length;
    }
}
