# Protocol

## Player chooses names

1.  request (`PUT_NAME`)  

        {
            action: "choose-name", // for debugging purposes only
            player-name: "Bastian"
        }

2.  response

        {
            status: "success" | "fail",
            message: "...",
            player-name: "Bastian",
            player-id: 1,
            player-color: "#FFFFFF"
        }

## When does the game start (polling)

1.  request (`GET_GAME_START`)
        
2.  response

        {
            players: [
                {
                    id: ${id},
                    name: ${name}
                }
            ],
            game-status: "start" | "waiting-for-more"
        }

## Assigning roles

1. request (`POST_ROLE`)

        {
            action: "get-role", // for debugging purposes only
            player-id: ${id}
        }

2. response

        {
            status: "success" | "fail",
            message: "...",
            player-id: {id},
            player-role: ${role}
        }

## Question Master declares topic

1. request (`PUT_TOPIC`)

        {
            action: "declare-topic", // for debugging purposes only
            topic: "..."
        }

2. response

        {
            status: "success" | "fail",
            message: "..."
        }

## Question Master declares term

1. request (`PUT_TERM`)

        {
            action: "declare-term", // for debugging purposes only
            term: "..."
        }

2. response

        {
            status: "success" | "fail",
            message: "..."
        }

## Artists fetch Topic and Term

This must be a POST request because the fake will only receive the topic

1. request (`POST_TOPIC_AND_TERM`)

        {
            action: "get-topic-and-term", // for debugging purposes only
            player-id: ${id}
        }

2. response

        {
            status: "success" | "fail",
            message: "...",
            topic: ${topic},
            term: ${term}
        }

## Whose turn is it

1.  request (`GET_ACTIVE_PLAYER`)

2.  response

        {
            active-player: {
                id: ${id},
                name: ${name}
            }
        }

    or

        {
            status: "fail",
            message: "Voting phase has started"
        }

## Live Draw

1.  request (`POST_LINE`)

        {
            action: "live-draw", // for debugging purposes only
            player-id: ${id},
            incomplete-line: {
                color: "#FFFFFF",
                points: [ {x: 0, y: 0}, {...} ]
            }
        }

2.  response

        {
            status: "success" | "fail",
            message: "..."
        }

## Finishing a draw turn

1.  request (`PUT_LINE`)

        {
            action: "finish-turn", // for debugging purposes only
            player-id: ${id},
            finished-line: {
                color: "#FFFFFF",
                points: [ {x: 0, y: 0}, {...} ]
            }
        }

2. response

        {
            status: "success" | "fail",
            message: "...",
            active-player: {
                id: ${id},
                name: ${name}
            }
        }

## Cast a vote

1. request (`PUT_VOTE`)

        {
            action: "cast-vote",
            voting-player: ${playerId},
            vote: ${voteId}
        }

2. response

        {
            status: "success" | "fail",
            message: "..."
        }

## Get Results

1. request (`GET_VOTES`)

2. response

        {
            result: [
                {
                    player: {
                        id: ${id},
                        name: ${name},
                        color: ${color}
                    },
                    votes: ${numberOfVotes}
                },
                {...}
            ],
            finished: true | false
        }

## Get Vote Evaluation

1. request (`POST_VOTE_EVALUATION`)

        {
            action: "vote-evaluation",
            player-id: ${id}
        }

2. response

        {
            status: "success" | "fail",
            message: "...",
            evaluation-result: "artist-win" | "wait-for-fake" | "detected" | ... TODO
        }