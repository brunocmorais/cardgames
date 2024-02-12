import { CardData } from "./cardData.js";
import { cardDistance, gameWidth } from "./constants.js";

export class CardsData {

    #cardsInfo = [];

    constructor(canvasWidth, freeCell) {

        for (let i = 0; i < freeCell.cards.length; i++) {
            const card = freeCell.cards[i];
            const image = new Image();
            image.src = `cards/${card.value}.png`;
            
            const x = 80 * (i % 8) + (Math.floor(canvasWidth / 2) - Math.floor(gameWidth / 2));
            const y = cardDistance * Math.floor(i / 8) + 140;
            const z = Math.floor((i / 8)) + 1;
    
            this.#cardsInfo.push(new CardData(x, y, z, false, image, card));
        }
    }

    toArray = () => [...this.#cardsInfo];

    getDraggingCard() {
        return this.getDraggingCards()[0];
    }

    getDraggingCards() {
        return this.#cardsInfo.filter(x => x.isDragging).sort((a, b) => a.z - b.z);
    }

    get(card) {
        return this.#cardsInfo.filter(x => x.card == card)[0];
    }
}