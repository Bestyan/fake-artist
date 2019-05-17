module.exports = {

    // polling interval while waiting for game to start
    GAME_START_POLLING_INTERVAL_MS: 1000,

    // polling interval to fetch active player
    ACTIVE_PLAYER_POLLING_INTERVAL_MS: 1000,

    // polling interval to fetch the current state of the canvas
    //smaller number -> higher load, but smoother drawing. never go below 50
    CANVAS_UPDATE_INTERVAL_MS: 1000,

    // number of players at which the game is launched
    AUTOLAUNCH_AT_X_PLAYERS: 2,

    // available player colors
    PLAYER_COLORS: [
        "#c10bea", //purple
        "#ff9f0f", //orange
        "#18d300", //green
        "#ff0000", //red
        "#002dd2" //blue
    ]

};