import { cardSize } from "../Constants.js";
export class CardData {
    x;
    y;
    z;
    isDragging;
    image;
    card;
    constructor(x, y, z, isDragging, image, card) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.isDragging = isDragging;
        this.image = image;
        this.card = card;
    }
    setCardPosition(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    isCardAboveObject(objectData) {
        return !(this.x > objectData.x + cardSize.width ||
            objectData.x > this.x + cardSize.width ||
            this.y > objectData.y + cardSize.height ||
            objectData.y > this.y + cardSize.height);
    }
    isMouseInsideCard(x, y) {
        return x > this.x && x < this.x + cardSize.width &&
            y > this.y && y < this.y + cardSize.height;
    }
}
