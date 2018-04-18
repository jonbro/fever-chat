/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.set = function (x, y) {
        if (x instanceof Vector) {
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x;
            this.y = y;
        }
    };
    Vector.distance = function (a, b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    };
    Vector.prototype.directionTo = function (other) {
        return Math.atan2(other.x - this.x, -(other.y - this.y)) * 180.0 / Math.PI;
    };
    Vector.prototype.rotation = function () {
        return Math.atan2(this.x, -this.y) * 180 / Math.PI;
    };
    Vector.prototype.addDirection = function (degrees, amount) {
        var radians = degrees * Math.PI / 180.0;
        this.x += Math.sin(radians) * amount;
        this.y -= Math.cos(radians) * amount;
        return this;
    };
    Vector.prototype.add = function (other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    };
    Vector.prototype.subtract = function (other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    };
    Vector.prototype.divide = function (scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    };
    Vector.prototype.multiply = function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    };
    Vector.prototype.rotate = function (angleDegrees) {
        if (angleDegrees == 0) {
            return this;
        }
        var radians = angleDegrees * Math.PI / 180;
        var tx = this.x;
        this.x = this.x * Math.cos(radians) - this.y * Math.sin(radians);
        this.y = tx * Math.sin(radians) + this.y * Math.cos(radians);
        return this;
    };
    Vector.prototype.copy = function () {
        return new Vector(this.x, this.y);
    };
    return Vector;
}());
exports.Vector = Vector;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Vector_1 = __webpack_require__(0);
var Display = /** @class */ (function () {
    function Display() {
        Display._instance = this;
        this.size = new Vector_1.Vector(640, 640);
        this.offset = this.size.copy().multiply(-0.5);
        this.displayElement = document.getElementById("display");
        this.context = this.displayElement.getContext("2d");
        this.displayElement.height = this.displayElement.width = 640;
    }
    Display.prototype.clear = function () {
        // clear the screen
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.size.x, this.size.y);
    };
    Display.prototype.drawPlayer = function (player) {
        var position = player.position.copy().add(this.size.copy().multiply(0.5));
        this.context.strokeStyle = "white";
        this.context.fillStyle = "white";
        this.context.beginPath();
        this.context.ellipse(position.x, position.y, 10, 10, 2 * Math.PI, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.beginPath();
        this.context.ellipse(position.x - 4, position.y - 1, 2, 2, 2 * Math.PI, 0, 2 * Math.PI);
        this.context.ellipse(position.x + 4, position.y - 1, 2, 2, 2 * Math.PI, 0, 2 * Math.PI);
        this.context.fill();
        this.drawText(player.currentMessage, player.messagePosition());
    };
    Display.prototype.drawText = function (text, position) {
        this.context.font = '17px serif';
        this.context.fillStyle = "white";
        this.context.fillText(text, position.x - this.offset.x, position.y - this.offset.y);
    };
    Display.textOffset = function (text) {
        var center = Display._instance.size.copy().multiply(0.5);
        var width = Display._instance.context.measureText(text).width;
        return new Vector_1.Vector(-width * 0.5, 0);
    };
    return Display;
}());
exports.Display = Display;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var SimplePlayer = /** @class */ (function () {
    function SimplePlayer(position, id) {
        this.position = position;
        this.id = id;
    }
    return SimplePlayer;
}());
exports.SimplePlayer = SimplePlayer;
var Message = /** @class */ (function () {
    function Message(content, position) {
        this.content = content;
        this.position = position;
    }
    return Message;
}());
exports.Message = Message;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Vector_1 = __webpack_require__(0);
var Display_1 = __webpack_require__(1);
var Player_1 = __webpack_require__(4);
var Data_1 = __webpack_require__(2);
// this would be the main game loop class in some other thing
var FeverChat = /** @class */ (function () {
    function FeverChat() {
        var _this = this;
        this.players = [];
        this.currentMessages = [];
        this.tick = 0;
        // handling update rates
        this.currentTime = 0;
        this.previousTime = 0;
        this.delta = 0;
        this.client = io();
        this.client.on("message", function (msg) {
            _this.currentMessages.push(msg);
        });
        this.client.on("player_connected", function (p) {
            var tp = new Player_1.Player();
            tp.id = p.id;
            tp.position = new Vector_1.Vector(p.position.x, p.position.y);
            console.log('got player connected info', tp, tp.position.copy);
            _this.players.push(tp);
        });
        this.client.on('player_disconnected', function (pid) {
            _this.players = _this.players.filter(function (p) { return p.id !== pid; });
            console.log("player disconnected", _this.players, pid);
        });
        this.client.on("player_update", function (p) {
            _this.players.forEach(function (player) {
                if (player.id == p.id) {
                    player.position = new Vector_1.Vector(p.position.x, p.position.y);
                }
            });
        });
        this.players.push(new Player_1.Player());
        this.players[0].setClientPlayer(this.client);
        this.display = new Display_1.Display();
        requestAnimationFrame(function (time) { _this.update(time); });
    }
    FeverChat.prototype.preupdate = function (time) {
        var _this = this;
        if (time) {
            this.currentTime = time;
        }
        else {
            this.currentTime = new Date().getTime();
        }
        this.delta += (this.currentTime - this.previousTime) / (1000 / 60);
        this.previousTime = this.currentTime;
        if (this.delta >= 0.75) {
            return true;
        }
        requestAnimationFrame(function (time) { _this.update(time); });
        return false;
    };
    FeverChat.prototype.update = function (time) {
        var _this = this;
        if (!this.preupdate(time)) {
            return;
        }
        // every 6th update, force the player to broadcast its position
        if (this.tick % 6 == 0) {
            this.client.emit("player_update", new Data_1.SimplePlayer(this.players[0].position, ""));
        }
        this.display.clear();
        this.currentMessages.forEach(function (msg) {
            _this.display.drawText(msg.content, msg.position);
        });
        this.players.forEach(function (player) {
            _this.display.drawPlayer(player);
        });
        this.tick++;
        this.delta = 0;
        requestAnimationFrame(function (time) { _this.update(time); });
    };
    return FeverChat;
}());
var chat;
window.onload = function () {
    chat = new FeverChat();
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Vector_1 = __webpack_require__(0);
var Display_1 = __webpack_require__(1);
var Data_1 = __webpack_require__(2);
var Player = /** @class */ (function () {
    function Player() {
        this.position = new Vector_1.Vector(0, 0);
        this.currentMessage = "";
        this.id = "";
    }
    Player.prototype.messagePosition = function () {
        return this.position.copy().add(new Vector_1.Vector(0, -20)).add(Display_1.Display.textOffset(this.currentMessage));
    };
    Player.prototype.setCurrentText = function (text) {
        this.currentMessage = text;
    };
    Player.prototype.setClientPlayer = function (client) {
        var _this = this;
        // bind all the key events
        window.onkeydown = function (e) {
            if (e.keyCode >= 37 && e.keyCode <= 40) {
                // move the player around
                // this actually needs to be done on update :/
                // and that means that I need to use delta time or something :?
                switch (e.keyCode) {
                    case 37:
                        _this.position.add(new Vector_1.Vector(-1, 0));
                        break;
                    case 38:
                        _this.position.add(new Vector_1.Vector(0, -1));
                        break;
                    case 39:
                        _this.position.add(new Vector_1.Vector(1, 0));
                        break;
                    case 40:
                        _this.position.add(new Vector_1.Vector(0, 1));
                        break;
                }
            }
            // need a much better filter here. this is the standard text input
            else if (e.keyCode >= 32 && e.keyCode <= 126) {
                _this.setCurrentText(_this.currentMessage + e.key);
            }
            else if (e.keyCode == 8) {
                // backspace
                _this.setCurrentText(_this.currentMessage.slice(0, -1));
            }
            // flush message buffer and send to server
            else if (_this.currentMessage != "") {
                client.emit("message", new Data_1.Message(_this.currentMessage, _this.messagePosition()));
                _this.setCurrentText("");
            }
            // allow the player to reload the page
            if (e.keyCode != 82) {
                e.preventDefault();
            }
        };
    };
    return Player;
}());
exports.Player = Player;


/***/ })
/******/ ]);