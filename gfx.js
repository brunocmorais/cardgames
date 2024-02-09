const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gameWidth = 630;
const cardSize = { width: 71, height: 96 };
const sleep = m => new Promise(r => setTimeout(r, m));
const freeCellInfo = updateFreeCellInfo(freeCells);
const foundationsInfo = updateFoundationInfo(foundations);
let cardsInfo = updateCardsInfo(cards);

function updateFreeCellInfo(cells) {
    return cells.map((cell, index) => {
        return {
            x: 80 * index + (Math.floor(canvas.width / 2) - Math.floor(gameWidth / 2)),
            y: 10,
            cell: cell
        };
    });
}

function updateFoundationInfo(cells) {
    return cells.map((cell, index) => {
        return {
            x: 80 * (index + 4) + (Math.floor(canvas.width / 2) - Math.floor(gameWidth / 2)),
            y: 10,
            cell: cell
        };
    });
}

function updateCardsInfo(cards) {
    return cards.map((card, index) => { 
        const image = new Image();
        image.src = "cards/" + card.value + ".png";
        
        const x = 80 * (index % 8) + (Math.floor(canvas.width / 2) - Math.floor(gameWidth / 2));
        const y = 20 * Math.floor(index / 8) + 120;

        return {
            x: x,
            y: y,
            cx: x,
            cy: y,
            isDragging: false,
            image: image,
            card: card
        };
    });
}

function drawCard(card) {
    ctx.drawImage(card.image, card.x, card.y, card.image.width, card.image.height);
}

function drawCell(cell, x, y) {
    ctx.drawImage(cell, x, y, cell.width, cell.height);
}

function isMouseInsideRect(card, x, y) {
    return x > card.x && x < card.x + cardSize.width &&
        y > card.y && y < card.y + cardSize.height;
}

canvas.addEventListener('mousedown', (e) => {

    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;

    const cardsClicked = cardsInfo.filter(x => isMouseInsideRect(x, mouseX, mouseY));

    if (cardsClicked.length > 0) {
        const cardInfo = cardsClicked[cardsClicked.length - 1];

        if (checkIfCardCanMove(cardInfo.card))
            cardInfo.isDragging = true;
    }
});

canvas.addEventListener('mousemove', async (e) => {
    const cardInfo = cardsInfo.filter(x => x.isDragging)[0];

    if (cardInfo && cardInfo.isDragging) {
        cardInfo.x = e.clientX - canvas.getBoundingClientRect().left - cardSize.width / 2;
        cardInfo.y = e.clientY - canvas.getBoundingClientRect().top - cardSize.height / 2;

        await drawGame();
    }
});

canvas.addEventListener('mouseup', async () => {
    const cardInfo = cardsInfo.filter(x => x.isDragging)[0];

    if (cardInfo) {
        cardInfo.isDragging = false;

        if (isMovingToFreeCell(cardInfo)) {

        } else {
            resetCardPosition(cardInfo);
        }

        await drawGame();
    }
});

function isMovingToFreeCell(cardInfo) {
    
}

function resetCardPosition(cardInfo) {
    cardInfo.x = cardInfo.cx;
    cardInfo.y = cardInfo.cy;
}

async function drawCells() {
    const cell = new Image();
    cell.src = "cards/empty.png";

    while (!cell.complete)
        await sleep(100);

    for (let i = 0; i < 4; i++) {
        const freeCell = freeCellInfo[i];
        drawCell(cell, freeCell.x, freeCell.y);
    }

    for (let i = 0; i < 4; i++) {
        const foundation = foundationsInfo[i];
        drawCell(cell, foundation.x, foundation.y);
    }
}

async function drawCards() {
    for (let i = 0; i < columns.length; i++) {
        for (let j = 0; j < columns[i].length; j++) {
            const card = columns[i][j];
            const cardInfo = cardsInfo.filter(x => x.card == card)[0];

            while (!cardInfo.image.complete)
                await sleep(100);

            drawCard(cardInfo);
        }
    }

    const movingCardsInfo = cardsInfo.filter(x => x.isDragging);
    
    if (movingCardsInfo.length > 0)
        for (const cardInfo of movingCardsInfo)
            drawCard(cardInfo);
}

async function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await drawCells();
    await drawCards();
}

drawGame();