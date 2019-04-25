import * as Constants from "../Constants";

export const updateCurrentLine = (currentLine, callback, errorCallback) => {
    const requestBody = {
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
        .then(json => {
            callback(json);
        })
        .catch(error => {
            errorCallback(error);
        });
};

export const putCanvasLine = (line, callback, errorCallback) => {
    const requestBody = {
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
        .then(json => {
            callback(json);
        })
        .catch(error => {
            errorCallback(error);
        });

};

export const fetchCanvasState = (callback, errorCallback) => {
    // console.log(`fetching from ${Constants.SERVER_ADDRESS}${Constants.GET_STATE}`);
    fetch(`${Constants.SERVER_ADDRESS}${Constants.GET_STATE}`, {
            method: "GET",
        })
        .then(response => response.json())
        .then(json => {
            callback(json);
        })
        .catch(error => {
            errorCallback(error);
        });
};