import { GameContextFactory } from './Common/GameContextFactory';
import { IGameContext } from './Common/IGameContext';
import { GameOptions } from './Common/Model/GameOptions';
import { EmptyGameContext } from './Empty/EmptyGameContext';
import { Sidebar } from './Sidebar';
import "./Styles/style.css";
import "./Styles/dialog.css";
import "fontawesome-4.7/css/font-awesome.min.css"

export class App {
    
    private sidebar : Sidebar;
    private game : IGameContext;

    constructor() {
        this.game = new EmptyGameContext();
        let gameOptions = GameOptions.load();
        this.sidebar = new Sidebar(this.game, gameOptions);

        if (gameOptions.lastGame) {
            this.game = GameContextFactory.get(gameOptions.lastGame);
            this.game.setOptions(gameOptions);
        } else {
            this.sidebar.showSelectGameDialog();
        }

        this.run();
    }

    private run() {
        this.game.drawGame(false);
    }
}