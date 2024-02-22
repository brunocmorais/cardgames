import { IGameContext } from './Common/IGameContext';
import { FreeCellGameContext } from './FreeCell/FreeCellGameContext'; 
import { SolitaireGameContext } from './Solitaire/SolitaireGameContext';

var a = document.createElement('a');
a.href = window.location.href;

const gameName = a.pathname
    .replace("/index.html", "")
    .replace(/\//gi, "");

let game : IGameContext;

if (gameName.endsWith("freecell"))
    game = new FreeCellGameContext();
else if (gameName.endsWith("solitaire"))
    game = new SolitaireGameContext();
else
    throw new Error("Unknown game!");

game.drawGame(false);
