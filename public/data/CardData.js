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
    isCardAboveObject(objectInfo) {
        return !(this.x > objectInfo.x + cardSize.width ||
            objectInfo.x > this.x + cardSize.width ||
            this.y > objectInfo.y + cardSize.height ||
            objectInfo.y > this.y + cardSize.height);
    }
    isMouseInsideCard(x, y) {
        return x > this.x && x < this.x + cardSize.width &&
            y > this.y && y < this.y + cardSize.height;
    }
}
