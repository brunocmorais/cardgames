import { Positions } from "../Positions.js";

export class MoveData {

    public index : number;
    public destination : Positions;

    constructor(objectInfo : number, destination : Positions) {
        this.index = objectInfo;
        this.destination = destination;
    }
}