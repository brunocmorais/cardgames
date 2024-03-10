import { IGameContext } from './Common/IGameContext';
import { EmptyGameContext } from './Empty/EmptyGameContext';
import { FreeCellGameContext } from './FreeCell/FreeCellGameContext'; 
import { SolitaireGameContext } from './Solitaire/SolitaireGameContext';

var a = document.createElement('a');
a.href = window.location.href;

const gameName = a.pathname
    .replace(".html", "")
    .replace(/\//gi, "");

let game : IGameContext;

const gameDict = {
    freecell : FreeCellGameContext,
    solitaire : SolitaireGameContext
};

const GameContext = gameDict[gameName as keyof typeof gameDict];

if (!GameContext)
    game = new EmptyGameContext();
else
    game = new GameContext();

game.drawGame(false);
