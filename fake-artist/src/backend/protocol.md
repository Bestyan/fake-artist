# Protocol

## Player chooses names

1.  request (PUT)  

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

## Whose turn is it

1.  request (GET)

2.  response

        {
            turn-id: ${id},
            turn-name: ${name}
        }

## Live Draw

1.  request (POST)

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

1.  request (PUT)

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
            turn-id: ${id},
            turn-name: ${name}
        }
