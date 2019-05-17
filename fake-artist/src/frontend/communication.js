import * as Constants from "../Constants";

// player chose a name
export const chooseName = (name, callback, errorCallback) => {
    const requestBody = {
        action: "choose-name",
        [Constants.PUT_NAME_CHOSEN_NAME]: name
    }

    fetch(`${Constants.SERVER_ADDRESS}${Constants.PUT_NAME}`, {
            method: "PUT",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(json => callback(json))
        .catch(error => errorCallback(error));
};

// waiting for the game to start
export const pollGameStart = (callback, errorCallback) => {
    fetch(`${Constants.SERVER_ADDRESS}${Constants.GET_GAME_START}`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(json => callback(json))
        .catch(error => errorCallback(error));
};

// polling whose turn it is
export const pollActivePlayer = (callback, errorCallback) => {
    fetch(`${Constants.SERVER_ADDRESS}${Constants.GET_ACTIVE_PLAYER}`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(json => callback(json))
        .catch(error => errorCallback(error));
}

// live-draw: others see what I'm drawing in (almost) real time
export const updateCurrentLine = (currentLine, playerId, callback, errorCallback) => {
    const requestBody = {
        action: "live-draw",
        [Constants.POST_LINE_PLAYER_ID]: playerId,
        [Constants.POST_LINE_INCOMPLETE_LINE]: currentLine
    };

    fetch(`${Constants.SERVER_ADDRESS}${Constants.POST_LINE}`, {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(json => callback(json))
        .catch(error => errorCallback(error));
};


export const finishDrawingTurn = (line, playerId, callback, errorCallback) => {
    const requestBody = {
        action: "finish-turn",
        [Constants.PUT_LINE_PLAYER_ID]: playerId,
        [Constants.PUT_LINE_FINISHED_LINE]: line
    };

    fetch(`${Constants.SERVER_ADDRESS}${Constants.PUT_LINE}`, {
            method: "PUT",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(json => callback(json))
        .catch(error => errorCallback(error));

};

export const fetchCanvasState = (callback, errorCallback) => {
    // console.log(`fetching from ${Constants.SERVER_ADDRESS}${Constants.GET_STATE}`);
    fetch(`${Constants.SERVER_ADDRESS}${Constants.GET_STATE}`, {
            method: "GET",
        })
        .then(response => response.json())
        .then(json => callback(json))
        .catch(error => errorCallback(error));
};