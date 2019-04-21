const express = require('express');
const server = express();
const port = 3001;

server.get('/hello', (request, response) => {
    response.json({
        data: 'Hello from Express!'
    });
});

server.listen(port, (err) => {
    if (err) {
        // port is already in use or something else went wrong
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
});