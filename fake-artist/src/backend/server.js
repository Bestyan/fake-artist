const Constants = require("../Constants");

const express = require('express');
const server = express();
// automatically parse request body to json. accessible via request.body
// https://stackoverflow.com/questions/10005939/how-do-i-consume-the-json-post-data-in-an-express-application
server.use(express.json());

// allow requests from the client (default is localhost:3000)
// if you get CORS errors, you probably did not use the Constants
const cors = require("cors");
const corsOptions = {
    origin: `${Constants.CLIENT_ADDRESS}`
};

server.use(cors(corsOptions));

// finished lines
const completedLines = [];
/**
 * line that is currently being drawn
 * format:
 * {
 *   color: "#000000",
 *   points: [ {x: 0, y: 0}, {...} ]
 * }
 */
let incompleteLine = {};

// GET FETCH_STATE
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

    console.log(data);

    response.json({
        status: "success"
    });
});

server.listen(Constants.SERVER_PORT, (error) => {
    if (error) {
        // port is already in use or something else went wrong
        return console.log('something bad happened', error);
    }

    console.log(`server is listening on ${Constants.SERVER_PORT}`);
});