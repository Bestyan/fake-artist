
// node server
const SERVER_URL = "http://localhost";
const SERVER_PORT = 3001;
const SERVER_ADDRESS = `${SERVER_URL}:${SERVER_PORT}`;

// react frontend server
const CLIENT_URL = "http://localhost";
const CLIENT_PORT = 3000;
const CLIENT_ADDRESS =  `${CLIENT_URL}:${CLIENT_PORT}`;

const RESPONSE_STATUS = "status";
const RESPONSE_MESSAGE = "message";

// path for PUT request to submit player name
const PUT_NAME = "/choose-name";
const PUT_NAME_PLAYER_ID = "player-id";
const PUT_NAME_PLAYER_NAME = "player-name";
const PUT_NAME_PLAYER_COLOR = "player-color";

const GET_GAME_START = "/game-start";
const GET_GAME_START_PLAYERS = "players";
const GET_GAME_START_STATUS = "game-status";


// path for GET request to get current canvas/game state
const GET_STATE = "/fetch-state";
// json object key to get canvas lines
const GET_STATE_LINES = "lines";

// path for PUT request to add a finished line
const PUT_LINE = "/put-line";
// json object key to get finished line data
const PUT_LINE_FINISHED_LINE = "finished-line";

// path for POST request to update the line that is currently being drawn
const POST_LINE = "/update-incomplete-line";
// json object key to get the incomplete line data
const POST_LINE_INCOMPLETE_LINE = "incomplete-line";

// ============================================================
// Game Logic Constants

// before being able to draw, every player has to choose a name
const PHASE_CHOOSE_NAME = "choose-name";
// after choosing a name, waiting for enough players to launch the game
const PHASE_GAME_START = "awaiting-game-start"
// players take turns drawing exactly one line each
const PHASE_DRAWING_TURNS = "drawing-turns";
const PHASE_ORDER = [
    PHASE_CHOOSE_NAME,
    PHASE_GAME_START,
    PHASE_DRAWING_TURNS
]


// es5 exports because node does not support es6 exports yet and I dont want to introduce babel just for this
module.exports = {

    SERVER_URL: SERVER_URL,
    SERVER_PORT: SERVER_PORT,
    SERVER_ADDRESS: SERVER_ADDRESS,

    CLIENT_URL: CLIENT_URL,
    CLIENT_PORT: CLIENT_PORT,
    CLIENT_ADDRESS: CLIENT_ADDRESS,

    RESPONSE_STATUS: RESPONSE_STATUS,
    RESPONSE_MESSAGE: RESPONSE_MESSAGE,

    PUT_NAME: PUT_NAME,
    PUT_NAME_PLAYER_NAME: PUT_NAME_PLAYER_NAME,
    PUT_NAME_PLAYER_ID: PUT_NAME_PLAYER_ID,
    PUT_NAME_PLAYER_COLOR: PUT_NAME_PLAYER_COLOR,

    GET_GAME_START: GET_GAME_START,
    GET_GAME_START_PLAYERS: GET_GAME_START_PLAYERS,
    GET_GAME_START_STATUS: GET_GAME_START_STATUS,

    GET_STATE: GET_STATE,
    GET_STATE_LINES: GET_STATE_LINES,
    
    PUT_LINE: PUT_LINE,
    PUT_LINE_FINISHED_LINE: PUT_LINE_FINISHED_LINE,

    POST_LINE: POST_LINE,
    POST_LINE_INCOMPLETE_LINE: POST_LINE_INCOMPLETE_LINE,


    PHASE_CHOOSE_NAME: PHASE_CHOOSE_NAME,
    PHASE_GAME_START: PHASE_GAME_START,
    PHASE_DRAWING_TURNS: PHASE_DRAWING_TURNS,

    PHASE_ORDER: PHASE_ORDER
};