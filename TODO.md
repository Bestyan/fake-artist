# TODO

## Frontend Roadmap

1. create mockups for
   1. "*choose name*" (entry page)
   2. "*in-game*" page (canvas)
   3. "*rules / tutorial*" page
2. create v0.1 in-game page (only canvas)
   1. fetch-calls to node server
      - GET: retrieve canvas state
      - POST: update canvas state when client draws on canvas
3. create basic layout
   1. create basic Header (placeholder)
   2. create Navigation with Routes
4. choose color scheme (use [this](https://coolors.co/)?)
5. create "*choose name*" entry page


## Backend Roadmap

1. set up Node Server
2. distribute canvas data to all clients

### v0.1 Live Draw for everyone **(done)**

- canvas data is updated on all clients in realtime
- first version of in-game page has a canvas everyone can draw on
- drawing on it sends POST updates to backend
- canvas is refreshed periodically 

### v0.2 Players taking turns drawing

- every player chooses a nickname
- a list of nicknames is displayed
- every player is assigned a color
- only one player can draw at a time
- finishing a line ends the player's turn

### v0.3 Pre-draw Phase

- one player is chosen as question master
- question master chooses a theme
- theme is displayed to everyone
- question masteer chooses a term around the theme
- term is displayed to everyone
- drawing starts

### v0.4 The Fake appears

- in the pre-draw Phase, one player is chosen as the fake
- the fake receives an X instead of the term

### v0.5 Voting Phase

- the drawing phase is limited to 2 rounds
- afterwards, every player votes for another player to be the Fake
- Voting results are displayed

### v0.6 The Fake can take a guess

- if the Fake is voted for the most (not tied), his identity is revealed
- the Fake can now take a guess on the term
- the guess is displayed to everyone

### v0.7 Evaluation

- if the Fake is not detected or their guess is correct:
  -  "You win" is displayed to the Fake and the Question Master
  -  "You lose" is displayed to everyone else
-  if the Fake is detected and their guess is wrong:
   -  "You lose" is displayed to the Fake and the Question Master
   -  "You win" is displayed to everyone else
- the game is complete, so this is the same as v1.0

### v1.0 You can play the game
1. choose a name
2. wait until x players are waiting to play
3. game starts on its own
4. one player (the question master) chooses a theme
5. the theme is displayed to everyone
6. the question master chooses a term around the theme
7. the term is displayed to everyone except one player (the Fake)
8. the Fake only sees an X
9. a randomly chosen player starts
10. you can draw one line
11. finishing the line ends your turn
12. after every player has drawn 2 lines, the round ends
13. every player votes for another player to be the fake
14. if the Fake has the most votes (not tied)
    1.  the Fake takes a guess at the term
    2.  if they are correct, they and the question master win
    3.  if they are not, everyone else wins
15. if the Fake does not have the most votes or the vote is tied
    1.  the Fake and the question master win
16. the results are displayed ("You win" or "You lose")

### v1.1 Quality of Life improvements

- time limit on turns
- time limit on choosing a theme and a term
- ...

### v2.0 *"It's actually pretty"*

- site has (done with material-UI)
  - header
  - footer
  - navigation
  - about (optional)
  - rules (optional)
