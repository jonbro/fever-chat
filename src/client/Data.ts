import {Vector} from "./Vector";

export class SimplePlayer {
    constructor(public position : Vector, readonly id : string) {}
}
export class Message {
    constructor(readonly content: string, readonly position: Vector) {}
}
