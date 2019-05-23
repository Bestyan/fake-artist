module.exports = {

    // polling interval to fetch something
    POLLING_INTERVAL_MS: 1000,

    // timeout after a failed fetch before repeating the request
    RETRY_TIMEOUT_MS: 500,

    // amount of time the "Your role is ..." screen stays
    DISPLAY_ROLE_TIME_MS: 2000,

    // amount of time the "The term is ..." screen stays
    DISPLAY_TERM_TIME_MS: 2000,

    // polling interval to fetch the current state of the canvas
    //smaller number -> higher load, but smoother drawing. never go below 50
    CANVAS_UPDATE_INTERVAL_MS: 1000,

    // number of players at which the game is launched
    AUTOLAUNCH_AT_X_PLAYERS: 3,

    // after how many rounds does the voting phase take place
    NUMBER_OF_DRAWING_ROUNDS: 1,

    // available player colors
    PLAYER_COLORS: [
        "#c10bea", //purple
        "#ff9f0f", //orange
        "#18d300", //green
        "#ff0000", //red
        "#002dd2" //blue
    ]

};