// es5 because node doesn't support es6 exports/imports
// mixing es6 and module.exports breaks everything, so es5 it is

const GameConfig = require("../game/GameConfig");
const Player = require("../game/Player");
const Constants = require("../Constants");

/**
 * manages the serverside game data
 */
function Game() {
    this.activePlayer = null;

    this.players = [];
    this.turnOrder = [];

    this.isStarted = false;
    this.availableColors = GameConfig.PLAYER_COLORS.slice(0); // clone color array
    shuffle(this.availableColors);

    this.topic = null;
    this.term = null;

    this.votes = {
        voteCounts: {},
        voted: []
    };

    this.currentDrawingRound = 1;
    // game is in voting phase
    this.isVoting = false;
    // voting has finished
    this.isDisplayingVoteResults = false;
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
    if (this.isStarted) {
        return;
    }

    if (this.players.length >= GameConfig.AUTOLAUNCH_AT_X_PLAYERS) {

        console.log("launching game");

        this.isStarted = true;
        this.assignRoles();
        this.determineTurnOrder();
        this.changeActivePlayer();
    }
};

Game.prototype.assignRoles = function () {
    roles = [Constants.GAME_ROLE_QUESTION_MASTER, Constants.GAME_ROLE_FAKE];
    for (let i = 2; i < this.players.length; i++) {
        roles.push(Constants.GAME_ROLE_ARTIST);
    }

    shuffle(roles);
    for (let i = 0; i < this.players.length; i++) {
        this.players[i].role = roles[i];
    }
}

Game.prototype.determineTurnOrder = function () {
    this.turnOrder = this.players.slice(0);
    shuffle(this.turnOrder);

    console.log("Turn order: " + JSON.stringify(this.turnOrder));
};

Game.prototype.changeActivePlayer = function () {
    if (!this.activePlayer) {
        this.activePlayer = this.turnOrder[0];
        return;
    }

    const activeIndex = this.turnOrder.indexOf(this.activePlayer);
    let nextIndex = (activeIndex + 1);
    if (nextIndex >= this.turnOrder.length) {
        nextIndex %= this.turnOrder.length;
        this.currentDrawingRound++;

        this.tryToStartVotingPhase();
    }
    this.activePlayer = this.turnOrder[nextIndex];

    console.log(`active player is now ${this.activePlayer.name}`);
};

/**
 * checks whether player id and player color match
 */
Game.prototype.isValidTurn = function (putLineData) {
    playerId = putLineData[Constants.PUT_LINE_PLAYER_ID];
    lineColor = putLineData[Constants.PUT_LINE_FINISHED_LINE].color;

    return playerId === this.activePlayer.id && lineColor === this.activePlayer.color;
};

/**
 * checks whether playerId exists
 */
Game.prototype.isValidPlayer = function (playerId) {
    return this.getPlayerById(playerId) !== null;
};

Game.prototype.getPlayerById = function (id) {
    for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].id === id) {
            return this.players[i];
        }
    }
    return null;
};

Game.prototype.getTermForPlayer = function (id) {
    const player = this.getPlayerById(id);

    if (player === null) {
        return null;
    }

    if (player.role === Constants.GAME_ROLE_FAKE) {
        if (this.term !== null) {
            return "X";
        }
    }
    return this.term;
};

Game.prototype.tryToStartVotingPhase = function () {
    if (this.currentDrawingRound <= GameConfig.NUMBER_OF_DRAWING_ROUNDS) {
        return;
    }

    console.log("voting phase started");

    // no active players anymore
    this.activePlayer = null;

    // init vote counts
    for (let i = 0; i < this.players.length; i++) {
        this.votes.voteCounts[this.players[i]] = 0;
    }

    console.log("vote counts initialized");
    this.isVoting = true;
};

/**
 * @returns {boolean} whether vote was successful
 */
Game.prototype.voteFor = function(voteForId, votedById){
    const votingPlayer = this.getPlayerById(votedById);
    const votedFor = this.getPlayerById(voteForId);
    if(this.votes.voted.includes(votingPlayer) || !votedFor){
        return false;
    }

    // mark player as voted
    this.votes.voted.push(votingPlayer);
    // increase vote count
    this.votes.voteCounts[votedFor]++;
    return true;
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