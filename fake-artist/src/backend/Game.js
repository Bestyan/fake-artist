// es5 because node doesn't support es6 exports/imports
// mixing es6 and module.exports breaks everything, so es5 it is

const GameConfig = require("../GameConfig");
const Player = require("../game/Player");

function Game() {
    this.currentTurn = null;
    this.players = [];
    this.isStarted = false;
    this.availableColors = GameConfig.PLAYER_COLORS.slice(0); // clone color array
};

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
}

/**
 * check if starting conditions are met
 * if so, start the game
 */
Game.prototype.tryToStart = function () {
    if (this.players.length >= GameConfig.AUTOLAUNCH_AT_X_PLAYERS) {
        this.isStarted = true;
    }
}

module.exports = Game;