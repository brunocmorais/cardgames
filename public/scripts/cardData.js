export class CardData {

    constructor(x, y, z, isDragging, image, card) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.cx = x;
        this.cy = y;
        this.cz = z;
        this.isDragging = isDragging;
        this.image = image;
        this.card = card;
    }

    setCardPosition(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.cx = x;
        this.cy = y;
        this.cz = z;
    }

    resetCardPosition() {
        this.x = this.cx;
        this.y = this.cy;
        this.z = this.cz;
    }
}