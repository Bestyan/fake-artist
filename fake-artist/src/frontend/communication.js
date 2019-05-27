import * as Constants from "../Constants";

// player chose a name
export const chooseName = (name, callback, errorCallback) => {
    const requestBody = {
        action: "choose-name",
        [Constants.PUT_NAME_CHOSEN_NAME]: name
    };

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

// fetch role assignment
export const fetchRole = (playerId, callback, errorCallback) => {
    const requestBody = {
        action: "get-role",
        [Constants.POST_ROLE_PLAYER_ID]: playerId
    };

    fetch(`${Constants.SERVER_ADDRESS}${Constants.POST_ROLE}`, {
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

// declare topic (question master)
export const declareTopic = (topic, callback, errorCallback) => {
    const requestBody = {
        action: "declare-topic",
        [Constants.PUT_TOPIC_TOPIC]: topic
    };

    fetch(`${Constants.SERVER_ADDRESS}${Constants.PUT_TOPIC}`, {
            method: "PUT",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(json => callback(json))
        .catch(error => errorCallback(error));
}

// declare term (question master)
export const declareTerm = (term, callback, errorCallback) => {
    const requestBody = {
        action: "declare-term",
        [Constants.PUT_TERM_TERM]: term
    };

    fetch(`${Constants.SERVER_ADDRESS}${Constants.PUT_TERM}`, {
            method: "PUT",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(json => callback(json))
        .catch(error => errorCallback(error));
}

// fetch topic and term (artists)
export const pollTopicAndTerm = (playerId, callback, errorCallback) => {
    const requestBody = {
        action: "get-topic-and-term",
        [Constants.POST_TOPIC_AND_TERM_PLAYER_ID]: playerId
    }

    fetch(`${Constants.SERVER_ADDRESS}${Constants.POST_TOPIC_AND_TERM}`, {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(json => callback(json))
        .catch(error => errorCallback(error));
}

// polling whose turn it is
export const pollActivePlayer = (callback, errorCallback) => {
    fetch(`${Constants.SERVER_ADDRESS}${Constants.GET_ACTIVE_PLAYER}`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(json => callback(json))
        .catch(error => errorCallback(error));
};

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

// special async fetchCanvasState for when the order in which things happen actually matters. 
export const fetchCanvasStateForSaving = async (callback, errorCallback) => {
    try {
        const response = await fetch(`${Constants.SERVER_ADDRESS}${Constants.GET_STATE}`, {
            method: "GET",
        });
        const json = await response.json();
        callback(json);
    } catch (error) {
        errorCallback(error);
    }
};

// cast a vote for a player to be the fake
export const castVote = (voteFor, votedBy, callback, errorCallback) => {
    const requestBody = {
        action: "cast-vote",
        [Constants.PUT_VOTE_VOTING_PLAYER]: votedBy,
        [Constants.PUT_VOTE_VOTE]: voteFor
    };

    fetch(`${Constants.SERVER_ADDRESS}${Constants.PUT_VOTE}`, {
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

// fetch the vote results
export const fetchVotes = (callback, errorCallback) => {
    fetch(`${Constants.SERVER_ADDRESS}${Constants.GET_VOTES}`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(json => callback(json))
        .catch(error => errorCallback(error));
};

// fetch the vote evaluation (fake is detected or not)
export const fetchEvaluation = (callback, errorCallback) => {
    fetch(`${Constants.SERVER_ADDRESS}${Constants.GET_FAKE_DETECTED}`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(json => callback(json))
        .catch(error => errorCallback(error));
};

// submit the fake's guess
export const submitGuess = (guess, id, callback, errorCallback) => {
    const requestBody = {
        action: "fake-guess",
        [Constants.PUT_GUESS_PLAYER_ID]: id,
        [Constants.PUT_GUESS_GUESS]: guess
    }

    fetch(`${Constants.SERVER_ADDRESS}${Constants.PUT_GUESS}`, {
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

export const fetchGuess = (callback, errorCallback) => {
    fetch(`${Constants.SERVER_ADDRESS}${Constants.GET_GUESS}`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(json => callback(json))
        .catch(error => errorCallback(error));
};