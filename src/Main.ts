import { BaseGameContext } from './Common/BaseGameContext';
import { FreeCellGameContext } from './FreeCell/FreeCellGameContext'; 
import { SolitaireGameContext } from './Solitaire/SolitaireGameContext';

var a = document.createElement('a');
a.href = window.location.href;

const gameName = a.pathname
    .replace("/index.html", "")
    .replace("/", "");

let game : BaseGameContext;

switch (gameName) {
    case "freecell":
        game = new FreeCellGameContext();
        break;
    case "solitaire":
        game = new SolitaireGameContext();
        break;
    default:
        throw new Error("Unknown game!");
}

game.drawGame(false);