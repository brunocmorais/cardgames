import { Position } from "../Position.js";

export class MoveData {

    public index : number;
    public destination : Position;

    constructor(objectData : number, destination : Position) {
        this.index = objectData;
        this.destination = destination;
    }
}