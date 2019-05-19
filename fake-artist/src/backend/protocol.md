# Protocol

## Player chooses names

1.  request (`PUT_NAME`)  

        {
            action: "choose-name",
            player-name: "Bastian"
        }

2.  response

        {
            status: "success"|"fail",
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

## Whose turn is it

1.  request (`GET_ACTIVE_PLAYER`)

2.  response

        {
            active-player: {
                id: ${id},
                name: ${name}
            }
        }

## Live Draw

1.  request (`POST_LINE`)

        {
            action: "live-draw",
            player-id: ${id},
            incomplete-line: {
                color: "#FFFFFF",
                points: [ {x: 0, y: 0}, {...} ]
            }
        }

2.  response

        {
            status: "success"|"fail",
            message: "..."
        }

## Finishing a draw turn

1.  request (`PUT_LINE`)

        {
            action: "finish-turn",
            player-id: ${id},
            finished-line: {
                color: "#FFFFFF",
                points: [ {x: 0, y: 0}, {...} ]
            }
        }

2. response

        {
            status: "success"|"fail",
            message: "...",
            active-player: {
                id: ${id},
                name: ${name}
            }
        }