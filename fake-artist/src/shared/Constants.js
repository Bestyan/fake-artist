// node server
const SERVER_URL = "http://localhost";
const SERVER_PORT = 3001;

// react frontend server
const CLIENT_URL = "http://localhost";
const CLIENT_PORT = 3000;

// ============================================================
// Game Logic Constants

// === Main Game Phases ===
// player chooses a name and waits for enough players to join
const PHASE_PRE_GAME = "choose-name-and-wait-for-players";
// question master chooses a topic and a term
const PHASE_PRE_DRAW = "question-master-declares-topic-and-term";
// players take turns drawing exactly one line each
const PHASE_DRAWING_TURNS = "drawing-turns";
// players vote on who's the fake
const PHASE_VOTING = "voting";
// fake guesses the term
const PHASE_FAKE_GUESS = "fake-guess";
// summary of the game. winners and losers
const PHASE_SUMMARY = "summary";

const PHASE_ORDER = [
    PHASE_PRE_GAME,
    PHASE_PRE_DRAW,
    PHASE_DRAWING_TURNS,
    PHASE_VOTING,
    PHASE_FAKE_GUESS,
    PHASE_SUMMARY
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
const PHASE_PRE_DRAW_DECLARE_TOPIC_AND_TERM = "question-master-declares-topic-and-term";

const PHASE_ORDER_PRE_DRAW = [
    PHASE_PRE_DRAW_AWAIT_ROLE,
    PHASE_PRE_DRAW_DECLARE_TOPIC_AND_TERM
];

// player hasnt voted yet
const PHASE_VOTING_CAST_VOTE = "cast-vote";
// player has voted
const PHASE_VOTING_VOTE_DONE = "player-vote-done";
// everyone has voted
const PHASE_VOTING_EVALUATION = "vote-evaluation";

const PHASE_ORDER_VOTING = [
    PHASE_VOTING_CAST_VOTE,
    PHASE_VOTING_VOTE_DONE,
    PHASE_VOTING_EVALUATION
];


// es5 exports because node does not support es6 exports yet and I dont want to introduce babel just for this
module.exports = {

    SERVER_URL: SERVER_URL,
    SERVER_PORT: SERVER_PORT,
    SERVER_ADDRESS: `${SERVER_URL}:${SERVER_PORT}`,

    CLIENT_URL: CLIENT_URL,
    CLIENT_PORT: CLIENT_PORT,
    CLIENT_ADDRESS: `${CLIENT_URL}:${CLIENT_PORT}`,

    // ============================================================
    // Game terms

    GAME_ROLE_QUESTION_MASTER: "question-master",
    GAME_ROLE_FAKE: "fake",
    GAME_ROLE_ARTIST: "artist",

    // ============================================================
    // Protocol (see /src/backend/protocol.md)

    RESPONSE_STATUS: "status",
    RESPONSE_MESSAGE: "message",

    // PUT request to submit player name
    PUT_NAME: "/choose-name",
    PUT_NAME_PLAYER_NAME: "player-name",
    PUT_NAME_PLAYER_ID: "player-id",
    PUT_NAME_PLAYER_COLOR: "player-color",

    // GET request to get game status (started or not started)
    GET_GAME_START: "/game-start",
    GET_GAME_START_PLAYERS: "players",
    GET_GAME_START_STATUS: "game-status",

    // POST request to get the assigned role
    POST_ROLE: "/fetch-player-role",
    POST_ROLE_PLAYER_ID: "player-id",
    POST_ROLE_PLAYER_ROLE: "player-role",

    // PUT request to declare topic (question master only!)
    PUT_TOPIC: "/declare-topic",
    PUT_TOPIC_TOPIC: "topic",

    // PUT request to declare term (question master only!)
    PUT_TERM: "/declare-term",
    PUT_TERM_TERM: "term",

    // POST request to fetch topic and term (artists)
    POST_TOPIC_AND_TERM: "/get-topic-and-term",
    POST_TOPIC_AND_TERM_PLAYER_ID: "player-id",
    POST_TOPIC_AND_TERM_TOPIC: "topic",
    POST_TOPIC_AND_TERM_TERM: "term",

    // GET request to get active player
    GET_ACTIVE_PLAYER: "/whose-turn-is-it",
    GET_ACTIVE_PLAYER_ACTIVE_PLAYER: "active-player",

    // POST request to update the line that is currently being drawn
    POST_LINE: "/update-incomplete-line",
    POST_LINE_PLAYER_ID: "player-id",
    POST_LINE_INCOMPLETE_LINE: "incomplete-line",

    // PUT request to submit a finished line
    PUT_LINE: "/finish-line",
    PUT_LINE_PLAYER_ID: "player-id",
    PUT_LINE_FINISHED_LINE: "finished-line",
    PUT_LINE_ACTIVE_PLAYER: "active-player",

    // GET request to get current canvas/game state
    GET_STATE: "/fetch-canvas-state",
    GET_STATE_LINES: "lines",

    // PUT request to vote for a player to be the fake
    PUT_VOTE: "/cast-vote",
    PUT_VOTE_VOTING_PLAYER: "voting-player",
    PUT_VOTE_VOTE: "vote",

    // GET request to get current vote counts
    GET_VOTES: "/get-vote-counts",
    GET_VOTES_RESULT: "result",
    GET_VOTES_RESULT_PLAYER: "player",
    GET_VOTES_RESULT_VOTES: "votes",
    GET_VOTES_FINISHED: "finished",

    // GET request to get whether fake was detected
    GET_FAKE_DETECTED: "/is-fake-detected",
    GET_FAKE_DETECTED_IS_DETECTED: "fake-is-detected",
    GET_FAKE_DETECTED_FAKE_PLAYER: "fake-player",
    GET_FAKE_DETECTED_NOT_DETECTED_BECAUSE: "not-detected-because",

    // PUT request to submit the fake's guess
    PUT_GUESS: "/submit-fake-guess",
    PUT_GUESS_PLAYER_ID: "player-id",
    PUT_GUESS_GUESS: "guess",
    PUT_GUESS_TERM: "term",
    PUT_GUESS_IS_CORRECT: "is-correct",

    // GET request to fetch the fake's guess
    GET_GUESS: "/get-fake-guess",
    GET_GUESS_HAS_GUESSED: "has-guessed-yet",
    GET_GUESS_GUESS: "guess",
    GET_GUESS_IS_CORRECT: "is-correct",

    // GET request to fetch game summary
    GET_SUMMARY: "/get-summary",
    GET_SUMMARY_PLAYERS: "players",
    GET_SUMMARY_TOPIC: "topic",
    GET_SUMMARY_TERM: "term",
    GET_SUMMARY_PICTURE: "picture",
    GET_SUMMARY_VOTE_RESULTS: "vote-results",
    GET_SUMMARY_IS_FAKE_DETECTED: "is-fake-detected",
    GET_SUMMARY_GUESS: "guess",
    GET_SUMMARY_IS_GUESS_CORRECT: "is-guess-correct",

    // ============================================================
    // Game Logic Constants

    // === Main Game Phases ===
    PHASE_PRE_GAME: PHASE_PRE_GAME,
    PHASE_PRE_DRAW: PHASE_PRE_DRAW,
    PHASE_DRAWING_TURNS: PHASE_DRAWING_TURNS,
    PHASE_VOTING: PHASE_VOTING,
    PHASE_FAKE_GUESS: PHASE_FAKE_GUESS,
    PHASE_SUMMARY: PHASE_SUMMARY,

    PHASE_ORDER: PHASE_ORDER,

    // === Sub Phase PRE_GAME ===
    PHASE_PRE_GAME_CHOOSE_NAME: PHASE_PRE_GAME_CHOOSE_NAME,
    PHASE_PRE_GAME_AWAIT_GAME_START: PHASE_PRE_GAME_AWAIT_GAME_START,

    PHASE_ORDER_PRE_GAME: PHASE_ORDER_PRE_GAME,

    // === Sub Phase PRE_DRAW ===
    PHASE_PRE_DRAW_AWAIT_ROLE: PHASE_PRE_DRAW_AWAIT_ROLE,
    PHASE_PRE_DRAW_DECLARE_TOPIC_AND_TERM: PHASE_PRE_DRAW_DECLARE_TOPIC_AND_TERM,

    PHASE_ORDER_PRE_DRAW: PHASE_ORDER_PRE_DRAW,

    // === Sub Phase VOTING ===
    PHASE_VOTING_CAST_VOTE: PHASE_VOTING_CAST_VOTE,
    PHASE_VOTING_VOTE_DONE: PHASE_VOTING_VOTE_DONE,
    PHASE_VOTING_EVALUATION: PHASE_VOTING_EVALUATION,

    PHASE_ORDER_VOTING: PHASE_ORDER_VOTING


};