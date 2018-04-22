import {Vector} from "./Vector";
import {Display} from "./Display";
import {Message} from "./Data";

export class Player
{
    position : Vector = new Vector(0,0);
    currentMessage : string = "";
    id : string = "";
    direction : boolean[] = [];
    messagePosition()
    {
        return this.position.copy().add(new Vector(0, -20)).add(Display.textOffset(this.currentMessage));
    }
    setCurrentText(text : string)
    {
        this.currentMessage = text;
    }
    setClientPlayer(client : SocketIOClient.Socket)
    {
        window.onkeyup = (e)=>
        {
            if(e.keyCode >= 37 && e.keyCode <= 40)
            {
                this.direction[e.keyCode] = false;
            }            
        }
        // bind all the key events
        window.onkeydown = (e) =>
        {
            if(e.keyCode >= 37 && e.keyCode <= 40)
            {
                this.direction[e.keyCode] = true;
            }
            // need a much better filter here. this is the standard text input
            else if(e.keyCode >= 32 && e.keyCode <= 126){
                this.setCurrentText(this.currentMessage+e.key);   
            }
            else if(e.keyCode == 8)
            {
                // backspace
                this.setCurrentText(this.currentMessage.slice(0,-1));   
            }
            // flush message buffer and send to server
            else if(this.currentMessage != "")
            {
                client.emit("message", new Message(this.currentMessage, this.messagePosition()));
                this.setCurrentText("");   
            }
            // allow the player to reload the page
            if(e.keyCode!=82)
            {
                e.preventDefault();    
            }
        }
    }
    update()
    {     
        let vel = new Vector(0,0);
        let hasInput : boolean = false;
        for (let i = 37; i <= 41; i++) {
            if(this.direction[i])
            {
                // should eventually make this a unit vector :/
                switch(i)
                {
                    case 37:
                        vel.add(new Vector(-1, 0));
                        break;
                    case 38:
                        vel.add(new Vector(0, -1));
                        break;
                    case 39:
                        vel.add(new Vector(1, 0));
                        break;
                    case 40:
                        vel.add(new Vector(0, 1));
                        break;
                }
                hasInput = true;
            }
        }
        if(hasInput)
        {
            this.position.add(vel.normalize());
        }
    }
}