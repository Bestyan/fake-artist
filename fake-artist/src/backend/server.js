/**
 * Note: imports use es5 syntax because as of 2019-04-25 node does not support es6 imports.
 */

const Constants = require("../Constants");

const Game = require("./Game");
/**
 * ============================================ SERVER CONFIG ============================================
 */
const express = require('express');
const server = express();
// automatically parse request body to json. accessible via request.body
// https://stackoverflow.com/questions/10005939/how-do-i-consume-the-json-post-data-in-an-express-application
server.use(express.json());

// allow requests from the client (default is localhost:3000)
// if you get CORS errors, you probably did not use the Constants (shame on you - ding ding ding - shame)
const cors = require("cors");
const corsOptions = {
    origin: `${Constants.CLIENT_ADDRESS}`
};

server.use(cors(corsOptions));
/**
 * ========================================== SERVER CONFIG END ==========================================
 */

// contains the completed lines in the same format as incompleteLine (see below)
const completedLines = [];
const game = new Game();
/**
 * line that is currently being drawn
 * format:
 * {
 *   color: "#000000",
 *   points: [ {x: 0, y: 0}, {...} ]
 * }
 */
let incompleteLine = {
    color: "#FFFFFF",
    points: []
};

// PUT PUT_NAME
server.put(`${Constants.PUT_NAME}`, (request, response) => {
    const playerName = request.body[Constants.PUT_NAME_CHOSEN_NAME];
    const player = game.addPlayer(playerName);

    if (game.isStarted || player === null) {
        console.log(`rejected player '${playerName}' because game has already started`);

        response.json({
            [Constants.RESPONSE_STATUS]: "fail",
            [Constants.RESPONSE_MESSAGE]: "game has already started"
        });
        return;
    }

    console.log(`added player: ${JSON.stringify(player)}`);

    const responseData = {
        [Constants.RESPONSE_STATUS]: "success",
        [Constants.RESPONSE_MESSAGE]: `player '${player.name}' was added`,
        [Constants.PUT_NAME_PLAYER_ID]: player.id,
        [Constants.PUT_NAME_PLAYER_NAME]: player.name,
        [Constants.PUT_NAME_PLAYER_COLOR]: player.color
    };
    response.json(responseData);

    game.tryToStart();
});

// GET GET_GAME_START
server.get(`${Constants.GET_GAME_START}`, (request, response) => {
    response.json({
        [Constants.GET_GAME_START_PLAYERS]: game.players,
        [Constants.GET_GAME_START_STATUS]: game.getStartedStatus()
    });
});

// GET GET_STATE
server.get(`${Constants.GET_STATE}`, (request, response) => {

    const lines = completedLines.slice(0);
    if (incompleteLine.points) {
        lines.push(incompleteLine);
    }

    const data = {
        [Constants.GET_STATE_LINES]: lines
    };

    // console.log(data);
    response.json(data);
});


//PUT PUT_LINE
server.put(`${Constants.PUT_LINE}`, (request, response) => {
    const data = request.body;
    completedLines.push(data[Constants.PUT_LINE_FINISHED_LINE]);

    // reset incomplete line
    // there is no check required, because updates on a new line aren't allowed until the last one has been submitted
    incompleteLine = {
        color: "#FFFFFF",
        points: []
    };

    console.log(data);

    response.json({
        [Constants.RESPONSE_STATUS]: "success",
        [Constants.RESPONSE_MESSAGE]: "line added"
    });
});

//POST POST_LINE
server.post(`${Constants.POST_LINE}`, (request, response) => {
    const data = request.body;
    const updatedLine = data[Constants.POST_LINE_INCOMPLETE_LINE];

    let status = null;
    let message = null;
    // check whether previous line has been submitted as finished or its color matches
    if (incompleteLine.points.length === 0 || incompleteLine.color == updatedLine.color) {
        incompleteLine = updatedLine;
        status = "success";
        message = "line updated";
    } else {
        status = "fail";
        message = "cannot update because previous line has not been submitted yet";
    }

    response.json({
        [Constants.RESPONSE_STATUS]: status,
        [Constants.RESPONSE_MESSAGE]: message
    });

});

server.listen(Constants.SERVER_PORT, (error) => {
    if (error) {
        // port is already in use or something else went wrong
        return console.log('something bad happened', error);
    }

    console.log(`server is listening on ${Constants.SERVER_PORT}`);
});