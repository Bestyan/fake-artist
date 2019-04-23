const express = require('express');
const server = express();
// automatically parse request body to json. accessible via request.body
// https://stackoverflow.com/questions/10005939/how-do-i-consume-the-json-post-data-in-an-express-application
server.use(express.json());

const cors = require("cors");
const corsOptions = {
    origin: 'http://localhost:3000'
};

server.use(cors(corsOptions));

const drawnLines = [];
const port = 3001;

server.get(`/canvas`, (request, response) => {
    response.json({
        lines: drawnLines
    });
});

server.put(`/putline`, (request, response) => {
    const data = request.body;
    drawnLines.push(data.line);

    console.log(data);
});

server.listen(port, (err) => {
    if (err) {
        // port is already in use or something else went wrong
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
});