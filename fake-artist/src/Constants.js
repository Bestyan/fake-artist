
const SERVER_URL = "http://localhost";
const SERVER_PORT = 3001;
const SERVER_ADDRESS = `${SERVER_URL}:${SERVER_PORT}`;

const CLIENT_URL = "http://localhost";
const CLIENT_PORT = 3000;
const CLIENT_ADDRESS =  `${CLIENT_URL}:${CLIENT_PORT}`;

const GET_STATE = "/fetch-state";
const GET_STATE_LINES = "lines";

const PUT_LINE = "/put-line";
const PUT_LINE_FINISHED_LINE = "finished-line";

// es5 exports because node does not support es6 exports yet and I dont want to introduce babel just for this
module.exports = {

    SERVER_URL: SERVER_URL,
    SERVER_PORT: SERVER_PORT,
    SERVER_ADDRESS: SERVER_ADDRESS,

    CLIENT_URL: CLIENT_URL,
    CLIENT_PORT: CLIENT_PORT,
    CLIENT_ADDRESS: CLIENT_ADDRESS,

    GET_STATE: GET_STATE,
    GET_STATE_LINES: GET_STATE_LINES,
    
    PUT_LINE: PUT_LINE,
    PUT_LINE_FINISHED_LINE: PUT_LINE_FINISHED_LINE
};