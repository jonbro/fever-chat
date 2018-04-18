"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    set(x, y) {
        if (x instanceof Vector) {
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x;
            this.y = y;
        }
    }
    static distance(a, b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }
    directionTo(other) {
        return Math.atan2(other.x - this.x, -(other.y - this.y)) * 180.0 / Math.PI;
    }
    rotation() {
        return Math.atan2(this.x, -this.y) * 180 / Math.PI;
    }
    addDirection(degrees, amount) {
        let radians = degrees * Math.PI / 180.0;
        this.x += Math.sin(radians) * amount;
        this.y -= Math.cos(radians) * amount;
        return this;
    }
    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    divide(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    rotate(angleDegrees) {
        if (angleDegrees == 0) {
            return this;
        }
        let radians = angleDegrees * Math.PI / 180;
        let tx = this.x;
        this.x = this.x * Math.cos(radians) - this.y * Math.sin(radians);
        this.y = tx * Math.sin(radians) + this.y * Math.cos(radians);
        return this;
    }
    copy() {
        return new Vector(this.x, this.y);
    }
}
exports.Vector = Vector;
