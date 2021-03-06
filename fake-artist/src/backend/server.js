/**
 * Note: imports use es5 syntax because as of 2019-04-25 node does not support es6 imports.
 */

const Constants = require("../Constants");
const Game = require("./Game");
const GameConfig = require("../shared/GameConfig");
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
    color: "#000000",
    points: []
};

// PUT_NAME
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

// GET_GAME_START
server.get(`${Constants.GET_GAME_START}`, (request, response) => {
    response.json({
        [Constants.GET_GAME_START_PLAYERS]: game.players,
        [Constants.GET_GAME_START_STATUS]: game.getStartedStatus()
    });
});

// POST_ROLE
server.post(`${Constants.POST_ROLE}`, (request, response) => {
    const playerId = request.body[Constants.POST_ROLE_PLAYER_ID];
    const isValid = game.isValidPlayer(playerId);

    if (!isValid) {
        response.json({
            [Constants.RESPONSE_STATUS]: "fail",
            [Constants.RESPONSE_MESSAGE]: `player with id ${playerId} does not exist`
        });
        return;
    }

    const player = game.getPlayerById(playerId);

    response.json({
        [Constants.RESPONSE_STATUS]: "success",
        [Constants.RESPONSE_MESSAGE]: `player-id ${player.id} has role ${player.role}`,
        [Constants.POST_ROLE_PLAYER_ID]: player.id,
        [Constants.POST_ROLE_PLAYER_ROLE]: player.role
    });
});

// PUT_TOPIC
server.put(`${Constants.PUT_TOPIC}`, (request, response) => {
    const topic = request.body[Constants.PUT_TOPIC_TOPIC];

    // TODO check if submitting player is question master

    game.topic = topic;

    response.json({
        [Constants.RESPONSE_STATUS]: "success",
        [Constants.RESPONSE_MESSAGE]: `the topic is '${topic}'`,
    });
});

// PUT_TERM
server.put(`${Constants.PUT_TERM}`, (request, response) => {
    const term = request.body[Constants.PUT_TERM_TERM];

    // TODO check if submitting player is question master

    game.term = term;

    response.json({
        [Constants.RESPONSE_STATUS]: "success",
        [Constants.RESPONSE_MESSAGE]: `the term is '${term}'`,
    });
});


// POST_TOPIC_AND_TERM
server.post(`${Constants.POST_TOPIC_AND_TERM}`, (request, response) => {
    const playerId = request.body[Constants.POST_TOPIC_AND_TERM_PLAYER_ID];

    if (!game.isValidPlayer(playerId)) {
        response.json({
            [Constants.RESPONSE_STATUS]: "fail",
            [Constants.RESPONSE_MESSAGE]: `player with id ${playerId} does not exist`
        });
        return;
    }

    const term = game.getTermForPlayer(playerId);

    response.json({
        [Constants.RESPONSE_STATUS]: "success",
        [Constants.RESPONSE_MESSAGE]: `the topic is '${game.topic}', the term is ${term}`,
        [Constants.POST_TOPIC_AND_TERM_TOPIC]: game.topic,
        [Constants.POST_TOPIC_AND_TERM_TERM]: term
    });
})

// GET_ACTIVE_PLAYER
server.get(`${Constants.GET_ACTIVE_PLAYER}`, (request, response) => {
    if (game.isVoting) {
        response.json({
            [Constants.RESPONSE_STATUS]: "fail",
            [Constants.RESPONSE_MESSAGE]: "Voting phase has started"
        });
        return;
    }

    response.json({
        [Constants.GET_ACTIVE_PLAYER_ACTIVE_PLAYER]: game.activePlayer
    });
})

// GET_STATE
server.get(`${Constants.GET_STATE}`, (request, response) => {

    const lines = game.completedLines.slice(0);
    if (incompleteLine.points) {
        lines.push(incompleteLine);
    }

    const data = {
        [Constants.GET_STATE_LINES]: lines
    };

    // console.log(data);
    response.json(data);
});

// POST_LINE
server.post(`${Constants.POST_LINE}`, (request, response) => {
    const data = request.body;
    const updatedLine = data[Constants.POST_LINE_INCOMPLETE_LINE];

    let status = null;
    let message = null;
    // check whether previous line has been submitted as finished or its color matches
    if (incompleteLine.points.length === 0 || incompleteLine.color === updatedLine.color) {
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

// PUT_LINE
server.put(`${Constants.PUT_LINE}`, (request, response) => {
    const data = request.body;
    if (!game.isValidTurn(data)) {
        response.json({
            [Constants.RESPONSE_STATUS]: "fail",
            [Constants.RESPONSE_MESSAGE]: "It's not your turn",
            [Constants.PUT_LINE_ACTIVE_PLAYER]: game.activePlayer
        });
        return;
    }

    game.completedLines.push(data[Constants.PUT_LINE_FINISHED_LINE]);

    // reset incomplete line
    // there is no check required, because updates on a new line aren't allowed until the last one has been submitted
    incompleteLine = {
        color: "#000000",
        points: []
    };

    game.changeActivePlayer();

    response.json({
        [Constants.RESPONSE_STATUS]: "success",
        [Constants.RESPONSE_MESSAGE]: "line added",
        [Constants.PUT_LINE_ACTIVE_PLAYER]: game.activePlayer
    });

});

// PUT_VOTE
server.put(`${Constants.PUT_VOTE}`, (request, response) => {
    const data = request.body;
    const voteForId = data[Constants.PUT_VOTE_VOTE];
    const votingPlayerId = data[Constants.PUT_VOTE_VOTING_PLAYER];
    const success = game.voteFor(voteForId, votingPlayerId);
    if (!success) {
        response.json({
            [Constants.RESPONSE_STATUS]: "fail",
            [Constants.RESPONSE_MESSAGE]: "vote was rejected",
        });
        return;
    }

    response.json({
        [Constants.RESPONSE_STATUS]: "success",
        [Constants.RESPONSE_MESSAGE]: `you voted for ${game.getPlayerById(voteForId).name}`,
    });
});

// GET_VOTES
server.get(`${Constants.GET_VOTES}`, (request, response) => {
    const result = game.voteState.result;
    const finished = game.voteState.isFinished;

    response.json({
        [Constants.GET_VOTES_RESULT]: result,
        [Constants.GET_VOTES_FINISHED]: finished
    });
});

// GET_FAKE_DETECTED
server.get(`${Constants.GET_FAKE_DETECTED}`, (request, response) => {
    response.json({
        [Constants.GET_FAKE_DETECTED_IS_DETECTED]: game.isFakeDetected(),
        [Constants.GET_FAKE_DETECTED_FAKE_PLAYER]: game.voteEvaluation.fake,
        [Constants.GET_FAKE_DETECTED_NOT_DETECTED_BECAUSE]: game.getNotDetectedBecause()
    });
});

// PUT_GUESS
server.put(`${Constants.PUT_GUESS}`, (request, response) => {
    const data = request.body;
    const playerId = data[Constants.PUT_GUESS_PLAYER_ID];
    const guess = data[Constants.PUT_GUESS_GUESS];

    const isValid = game.evaluateGuess(guess, playerId);

    if (!isValid) {
        response.json({
            [Constants.RESPONSE_STATUS]: "fail",
            [Constants.RESPONSE_MESSAGE]: "guess was rejected"
        });
        return;
    }

    response.json({
        [Constants.RESPONSE_STATUS]: "success",
        [Constants.RESPONSE_MESSAGE]: "guess was evaluated",
        [Constants.PUT_GUESS_IS_CORRECT]: game.guessEvaluation.isCorrect,
        [Constants.PUT_GUESS_TERM]: game.term
    });
});

// GET_GUESS
server.get(`${Constants.GET_GUESS}`, (request, response) => {
    const guessResult = game.guessEvaluation;
    response.json({
        [Constants.GET_GUESS_HAS_GUESSED]: guessResult.isEvaluated,
        [Constants.GET_GUESS_GUESS]: guessResult.guess,
        [Constants.GET_GUESS_IS_CORRECT]: guessResult.isCorrect
    });
});

server.listen(Constants.SERVER_PORT, (error) => {
    if (error) {
        // port is already in use or something else went wrong
        return console.log('something bad happened', error);
    }

    console.log(`server is listening on ${Constants.SERVER_PORT}`);
});

// GET_SUMMARY
server.get(`${Constants.GET_SUMMARY}`, (request, response) => {

    if(!game.isFinished){
        response.json({
            [Constants.RESPONSE_STATUS]: "fail",
            [Constants.RESPONSE_MESSAGE]: "game has not concluded yet"
        });
        return;
    }

    response.json({
        [Constants.GET_SUMMARY_PLAYERS]: game.players,
        [Constants.GET_SUMMARY_TOPIC]: game.topic,
        [Constants.GET_SUMMARY_TERM]: game.term,
        [Constants.GET_SUMMARY_PICTURE]: game.picture,
        [Constants.GET_SUMMARY_VOTE_RESULTS]: game.voteState.result,
        [Constants.GET_SUMMARY_IS_FAKE_DETECTED]: game.isFakeDetected(),
        [Constants.GET_SUMMARY_GUESS]: game.guessEvaluation.guess,
        [Constants.GET_SUMMARY_IS_GUESS_CORRECT]: game.guessEvaluation.isCorrect
    });

    setTimeout(game.reset.bind(game), GameConfig.RESET_TIMEOUT_MS);
})
