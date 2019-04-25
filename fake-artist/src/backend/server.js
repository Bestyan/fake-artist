/**
 * Note: imports use es5 syntax because as of 2019-04-25 node does not support es6 imports.
 */

const Constants = require("../Constants");
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
/**
 * line that is currently being drawn
 * format:
 * {
 *   color: "#000000",
 *   points: [ {x: 0, y: 0}, {...} ]
 * }
 */
let incompleteLine = [];

// GET GET_STATE
server.get(`${Constants.GET_STATE}`, (request, response) => {

    const lines = completedLines.slice(0);
    if (incompleteLine || incompleteLine.points) {
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
    incompleteLine = [];

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
    if (!incompleteLine || incompleteLine.color == updatedLine.color) {
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
    })

})

server.listen(Constants.SERVER_PORT, (error) => {
    if (error) {
        // port is already in use or something else went wrong
        return console.log('something bad happened', error);
    }

    console.log(`server is listening on ${Constants.SERVER_PORT}`);
});