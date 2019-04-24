
const Constants = require("../Constants");

const express = require('express');
const server = express();
// automatically parse request body to json. accessible via request.body
// https://stackoverflow.com/questions/10005939/how-do-i-consume-the-json-post-data-in-an-express-application
server.use(express.json());

// allow requests from port 3000
const cors = require("cors");
const corsOptions = {
    origin: `${Constants.CLIENT_ADDRESS}`
};

console.log(corsOptions);

server.use(cors(corsOptions));

const drawnLines = [];

server.get(`${Constants.FETCH_STATE}`, (request, response) => {
    response.json({
        lines: drawnLines
    });
});

server.put(`${Constants.PUT_LINE}`, (request, response) => {
    const data = request.body;
    drawnLines.push(data.line);

    console.log(data);
    response.json({
        status: "success"
    });
});

server.listen(Constants.SERVER_PORT, (err) => {
    if (err) {
        // port is already in use or something else went wrong
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${Constants.SERVER_PORT}`);
});