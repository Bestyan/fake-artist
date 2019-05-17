// es5 because node doesn't support es6 exports/imports
// mixing es6 and module.exports breaks everything, so es5 it is

const GameConfig = require("../GameConfig");
const Player = require("../game/Player");
const Constants = require("../Constants");

/**
 * manages the serverside game data
 */
function Game() {
    this.activePlayer = null;
    this.players = [];
    this.isStarted = false;
    this.availableColors = GameConfig.PLAYER_COLORS.slice(0); // clone color array
    this.turnOrder = [];
}

Game.prototype.addPlayer = function (playerName) {
    if (this.isStarted) {
        return null;
    }

    const nextId = Player.getNextId();
    const color = this.availableColors.pop();
    const player = new Player(playerName, nextId, color);

    console.log(player);

    this.players.push(player);

    return player;
};

Game.prototype.getStartedStatus = function () {
    this.tryToStart();
    if (this.isStarted) {
        return "start";
    } else {
        return "waiting-for-more";
    }
};

/**
 * check if starting conditions are met
 * if so, start the game
 */
Game.prototype.tryToStart = function () {
    if (this.players.length >= GameConfig.AUTOLAUNCH_AT_X_PLAYERS) {

        console.log("launching game");

        this.isStarted = true;
        this.determineTurnOrder();
        this.changeActivePlayer();
    }
};

Game.prototype.determineTurnOrder = function(){
    this.turnOrder = this.players.slice(0);
    shuffle(this.turnOrder);

    console.log("Turn order: " + this.turnOrder.toString());
};

Game.prototype.changeActivePlayer = function(){
    if(!this.activePlayer){
        this.activePlayer = this.turnOrder[0];
        return;
    }

    const activeIndex = this.turnOrder.indexOf(this.activePlayer);
    const nextIndex = (activeIndex + 1) % this.turnOrder.length;
    this.activePlayer = this.turnOrder[nextIndex];

    console.log(`active player is now ${this.activePlayer.name}`);
};

Game.prototype.isValidTurn = function(putLineData){
    playerId = putLineData[Constants.PUT_LINE_PLAYER_ID];
    lineColor = putLineData[Constants.PUT_LINE_FINISHED_LINE].color;

    return playerId === this.activePlayer.id && lineColor === this.activePlayer.color;
};

module.exports = Game;

/**
 * Shuffles array in place. modern version of the Fisher Yates Shuffle
 * https://stackoverflow.com/a/6274381
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}