import * as socketClient from "socket.io-client"
import {Vector} from "./Vector";
import {Display} from "./Display";
import {Player} from "./Player";
import {Message, SimplePlayer} from "./Data";

// this would be the main game loop class in some other thing
class FeverChat
{
    players : Player[] = [];
    display : Display;
    currentMessages : Message[] = [];
    client : SocketIOClient.Socket;
    tick : number = 0;
    // handling update rates
    private currentTime : number = 0;
    private previousTime : number = 0;
    private delta : number = 0;

    constructor()
    {
        this.client = io();
        this.client.on("message", (msg : Message)=>{
            this.currentMessages.push(msg);
        });
        this.client.on("player_connected", (p : SimplePlayer)=>{
            let tp : Player = new Player();
            tp.id = p.id;
            tp.position = new Vector(p.position.x, p.position.y);
            console.log('got player connected info', tp, tp.position.copy);
            this.players.push(tp);
        });
        this.client.on('player_disconnected', (pid : string)=>{
            this.players = this.players.filter(p => p.id !== pid);
            console.log("player disconnected", this.players, pid);
        });
        this.client.on("player_update", (p : SimplePlayer) =>{
            this.players.forEach(player => {
                if(player.id == p.id)
                {
                    player.position = new Vector(p.position.x, p.position.y);
                }
            });
        })
        this.players.push(new Player());
        this.players[0].setClientPlayer(this.client);
        this.display = new Display();
        requestAnimationFrame((time) => {this.update(time)});
    }
    preupdate(time:number)
    :boolean
    {
        if(time)
        {
            this.currentTime = time;
        }
        else
        {
            this.currentTime = new Date().getTime();
        }
        this.delta += (this.currentTime - this.previousTime) / (1000/60);
        this.previousTime = this.currentTime;
        if(this.delta >= 0.75)
        {
            return true;
        }
        requestAnimationFrame((time) => {this.update(time)});
        return false;
    }
    update(time:number)
    {
        if(!this.preupdate(time))
        {
            return;
        }
        // every 6th update, force the player to broadcast its position
        if(this.tick%6==0)
        {
            this.client.emit("player_update", new SimplePlayer(this.players[0].position, ""));
        }
        this.display.clear();
        this.currentMessages.forEach(msg => {
            this.display.drawText(msg.content, msg.position);            
        });
        this.players[0].update();
        // update the display to center on the player
        this.display.offset = new Vector(this.players[0].position.x-this.display.size.x*0.5, this.players[0].position.y-this.display.size.y*0.5);
        this.players.forEach(player =>{
            this.display.drawPlayer(player);
        });
        this.tick++;
        this.delta = 0;
        requestAnimationFrame((time) => {this.update(time)});
        
    }
}
var chat : FeverChat;
window.onload = function()
{
    chat = new FeverChat();
}