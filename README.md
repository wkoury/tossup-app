# Installation

Make sure you have NodeJS installed first.

Clone this repository, and then run the following commands:
```
npm install
npm run build
```

There are 2 ways to run this app:

### Development
You will need 2 terminals for this. In the first terminal, run ```npm run dev```. In the second terminal run ```cd client``` and then run ```npm start```.

### Production
The Express server can serve the React app if you have built the React app (this can be done by running ```npm run build``` in the root directory). If the build exists, simply run ```npm start``` in the root directory. If you open your browswer to http://localhost:8085, you should see the production version of your React app.

### Other Notes
The default proxy port is 8085, but you can change this in client/package.json and server.js.

# Progress
- [ ] Add buzzer sound to, at the very least, the ```Admin``` page (possibly the ```Game``` too)
- [ ] Add error handling to the Express server
- [x] Highlight the team that has buzzed (makes bonuses easier)
- [ ] Add disconnect button for users (allows name change)
- [ ] Create data component as parent to ```Admin``` and ```Game```
- [x] Support multiple simultaneous instances (socket.io rooms)
- [ ] Add toggle teams feature
- [x] Improve handling of user disconnects
- [ ] Allow admins to remove players
- [ ] Add light mode and dark mode (be able to toggle them!)
