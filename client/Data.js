"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SimplePlayer {
    constructor(position, id) {
        this.position = position;
        this.id = id;
    }
}
exports.SimplePlayer = SimplePlayer;
class Message {
    constructor(content, position) {
        this.content = content;
        this.position = position;
    }
}
exports.Message = Message;
