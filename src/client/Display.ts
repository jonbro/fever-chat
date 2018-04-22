import {Vector} from "./Vector";
import {Player} from "./Player";

export class Display
{
    displayElement : HTMLCanvasElement;
    context : CanvasRenderingContext2D;
    size : Vector;
    // represents the upper left corner world offset
    offset : Vector;
    private static _instance : Display;
    constructor()
    {
        Display._instance = this;
        this.size = new Vector(640,640);
        this.offset = this.size.copy().multiply(-0.5);
        this.displayElement = <HTMLCanvasElement>document.getElementById("display");
        this.context = this.displayElement.getContext("2d");
        this.displayElement.height = this.displayElement.width = 640;
    }
    clear()
    {
        // clear the screen
        this.context.fillStyle = "black";
        this.context.fillRect(0,0,this.size.x, this.size.y);
    }
    drawPlayer(player : Player)
    {
        let position = player.position.copy().subtract(this.offset);
        this.context.strokeStyle = "white";
        this.context.fillStyle = "white";
        this.context.beginPath();
        this.context.ellipse(position.x, position.y, 10, 10, 2 * Math.PI, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.beginPath();
        this.context.ellipse(position.x-4, position.y-1, 2, 2, 2 * Math.PI, 0, 2 * Math.PI);
        this.context.ellipse(position.x+4, position.y-1, 2, 2, 2 * Math.PI, 0, 2 * Math.PI);
        this.context.fill();
        this.drawText(player.currentMessage, player.messagePosition());
    }
    drawText(text: string, position : Vector)
    {
        this.context.font = '17px serif';
        this.context.fillStyle = "white";
        this.context.fillText(text, position.x-this.offset.x, position.y-this.offset.y);
    }
    static textOffset(text : string) : Vector
    {
        let width = Display._instance.context.measureText(text).width;
        return new Vector(-width*0.5,0);
    }
}