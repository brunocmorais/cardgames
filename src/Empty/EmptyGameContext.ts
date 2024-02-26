import { BaseGameContext } from "../Common/BaseGameContext";
import { BaseCardsData } from "../Common/Data/BaseCardsData";
import { CardData } from "../Common/Data/CardData";
import { IGameData } from "../Common/Data/IGameData";
import { IGame } from "../Common/IGame";
import { EmptyCardsData } from "./EmptyCardsData";

export class EmptyGameContext extends BaseGameContext<IGame, IGameData> {

    constructor() {
        super({}, new EmptyCardsData(0));
    }

    protected getCardsData(): BaseCardsData { return new EmptyCardsData(0); }
    protected async doActionWithDblClickedCards(cardsClicked: CardData[]): Promise<void> {}
    protected async doActionWithClick(e: MouseEvent): Promise<void> { }
    protected async doActionWithSelectedCards(cards: CardData[]): Promise<void> { }
    protected async doActionWithReleasedCards(cards: CardData[]): Promise<void> { }
}