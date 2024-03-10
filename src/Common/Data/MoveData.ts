export class MoveData {

    public index : number;
    public destination : number;

    constructor(objectData : number, destination : number) {
        this.index = objectData;
        this.destination = destination;
    }
}