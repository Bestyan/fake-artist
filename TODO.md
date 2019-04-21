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

### v0.1 frontend goals

- first version of in-game page has a canvas everyone can draw on
- drawing on it sends POST updates to backend
- canvas is refreshed periodically 

## Backend Roadmap

1. set up Node Server
2. distribute canvas data to all clients

### v0.1 backend goals

- canvas data is updated on all clients in realtime
- everyone can draw

