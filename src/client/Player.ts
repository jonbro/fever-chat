import {Vector} from "./Vector";
import {Display} from "./Display";
import {Message} from "./Data";

export class Player
{
    position : Vector = new Vector(0,0);
    currentMessage : string = "";
    id : string = "";
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
        // bind all the key events
        window.onkeydown = (e) =>
        {
            if(e.keyCode >= 37 && e.keyCode <= 40)
            {
                // move the player around
                // this actually needs to be done on update :/
                // and that means that I need to use delta time or something :?
                switch(e.keyCode)
                {
                    case 37:
                        this.position.add(new Vector(-1, 0));
                        break;
                    case 38:
                        this.position.add(new Vector(0, -1));
                        break;
                    case 39:
                        this.position.add(new Vector(1, 0));
                        break;
                    case 40:
                        this.position.add(new Vector(0, 1));
                        break;
                }
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
}