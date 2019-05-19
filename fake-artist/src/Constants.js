
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

// PUT request to submit player name
const PUT_NAME = "/choose-name";
const PUT_NAME_PLAYER_ID = "player-id";
const PUT_NAME_PLAYER_NAME = "player-name";
const PUT_NAME_PLAYER_COLOR = "player-color";

// GET request to get game status (started or not started)
const GET_GAME_START = "/game-start";
const GET_GAME_START_PLAYERS = "players";
const GET_GAME_START_STATUS = "game-status";

// GET request to get active player
const GET_ACTIVE_PLAYER = "/whose-turn-is-it"
const GET_ACTIVE_PLAYER_ACTIVE_PLAYER = "active-player";

// POST request to update the line that is currently being drawn
const POST_LINE = "/update-incomplete-line";
const POST_LINE_PLAYER_ID = "player-id";
const POST_LINE_INCOMPLETE_LINE = "incomplete-line";

// GET request to get current canvas/game state
const GET_STATE = "/fetch-state";
// json object key to get canvas lines
const GET_STATE_LINES = "lines";

// PUT request to add a finished line
const PUT_LINE = "/put-line";
const PUT_LINE_PLAYER_ID = "player-id";
const PUT_LINE_FINISHED_LINE = "finished-line";
const PUT_LINE_ACTIVE_PLAYER = "active-player";

// ============================================================
// Game Logic Constants

// === Main Game Phases ===
// player chooses a name and waits for enough players to join
const PHASE_PRE_GAME = "choose-name-and-wait-for-players";
// question master chooses a topic and a term
const PHASE_PRE_DRAW = "question-master-declares-topic-and-term";
// players take turns drawing exactly one line each
const PHASE_DRAWING_TURNS = "drawing-turns";
const PHASE_ORDER = [
    PHASE_PRE_GAME,
    PHASE_PRE_DRAW,
    PHASE_DRAWING_TURNS
]

// === Sub Game Phases ===

// before being able to draw, every player has to choose a name
const PHASE_PRE_GAME_CHOOSE_NAME = "choose-name";
// after choosing a name, waiting for enough players to launch the game
const PHASE_PRE_GAME_AWAIT_GAME_START = "awaiting-game-start";
// subphase order PRE_GAME
const PHASE_ORDER_PRE_GAME = [
    PHASE_PRE_GAME_CHOOSE_NAME,
    PHASE_PRE_GAME_AWAIT_GAME_START
];

// wait for role assignment from server
const PHASE_PRE_DRAW_AWAIT_ROLE = "await-role";
// question master declares a topic and term
const PHASE_PRE_DRAW_DECLARE_TOPIC = "question-master-declares-topic";
const PHASE_PRE_DRAW_DECLARE_TERM = "question-master-declares-term";

const PHASE_ORDER_PRE_DRAW = [
    PHASE_PRE_DRAW_AWAIT_ROLE,
    PHASE_PRE_DRAW_DECLARE_TOPIC,
    PHASE_PRE_DRAW_DECLARE_TERM
];

// es5 exports because node does not support es6 exports yet and I dont want to introduce babel just for this
// TODO refactor this to put all the info directly in here
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

    POST_ROLE: "/fetch-player-role",
    POST_ROLE_PLAYER_ID: "player-id",
    POST_ROLE_PLAYER_ROLE: "player-role",

    GET_ACTIVE_PLAYER: GET_ACTIVE_PLAYER,
    GET_ACTIVE_PLAYER_ACTIVE_PLAYER: GET_ACTIVE_PLAYER_ACTIVE_PLAYER,

    POST_LINE: POST_LINE,
    POST_LINE_PLAYER_ID: POST_LINE_PLAYER_ID,
    POST_LINE_INCOMPLETE_LINE: POST_LINE_INCOMPLETE_LINE,

    PUT_LINE: PUT_LINE,
    PUT_LINE_PLAYER_ID: PUT_LINE_PLAYER_ID,
    PUT_LINE_FINISHED_LINE: PUT_LINE_FINISHED_LINE,
    PUT_LINE_ACTIVE_PLAYER: PUT_LINE_ACTIVE_PLAYER,

    GET_STATE: GET_STATE,
    GET_STATE_LINES: GET_STATE_LINES,

    // === Main Game Phases ===
    PHASE_PRE_GAME: PHASE_PRE_GAME,
    PHASE_PRE_DRAW: PHASE_PRE_DRAW,
    PHASE_DRAWING_TURNS: PHASE_DRAWING_TURNS,

    PHASE_ORDER: PHASE_ORDER,

    // === Sub Phase PRE_GAME ===
    PHASE_PRE_GAME_CHOOSE_NAME: PHASE_PRE_GAME_CHOOSE_NAME,
    PHASE_PRE_GAME_AWAIT_GAME_START: PHASE_PRE_GAME_AWAIT_GAME_START,

    PHASE_ORDER_PRE_GAME: PHASE_ORDER_PRE_GAME,

    // === Sub Phase PRE_DRAW ===
    PHASE_PRE_DRAW_AWAIT_ROLE: PHASE_PRE_DRAW_AWAIT_ROLE,
    PHASE_PRE_DRAW_DECLARE_TOPIC: PHASE_PRE_DRAW_DECLARE_TOPIC,
    PHASE_PRE_DRAW_DECLARE_TERM: PHASE_PRE_DRAW_DECLARE_TERM,

    PHASE_ORDER_PRE_DRAW: PHASE_ORDER_PRE_DRAW


};