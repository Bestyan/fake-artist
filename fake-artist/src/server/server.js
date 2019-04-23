import * as Constants from "../Constants.js";

const express = require('express');
const server = express();
const port = 3001;

const drawnLines = [];

server.get('/canvas', (request, response) => {
    response.json({
        lines: drawnLines
    });
});

server.put()

server.listen(port, (err) => {
    if (err) {
        // port is already in use or something else went wrong
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
});