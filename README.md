# Installation

Make sure you have NodeJS installed first.

Clone this repository, and then run the following commands:
```
yarn
yarn build
```

There are 2 ways to run this app:

### Development
You will need 2 terminals for this. In the first terminal, run ```yarn dev```. In the second terminal run ```cd client``` and then run ```yarn start```.

### Production
The Express server can serve the React app if you have built the React app (this can be done by running ```yarn build``` in the root directory). If the build exists, simply run ```yarn start``` in the root directory. If you open your browser to http://localhost:8085, you should see the production version of your React app.

### Other Notes
The default proxy port is 8085, but you can change this in client/package.json and server.js.

# Progress
- [ ] Allow admins to remove players
- [ ] Research how to decentralize Tossup (let people run their own local instances without Internet)
- [ ] Implement Redis for persistent matches across server restarts (or at least see if this is possible)?
- [ ] Automated testing
- [x] Add custom teams option
- [x] Fix keystroke event listener
- [x] Add buzzer sound to, at the very least, the ```Admin``` page (possibly the ```Game``` too)
- [x] Add error handling to the Express server
- [x] Highlight the team that has buzzed (makes bonuses easier)
- [x] Create data component as parent to ```Admin``` and ```Game```
- [x] Support multiple simultaneous instances (socket.io rooms)
- [x] Add toggle teams feature
- [x] Improve handling of user disconnects
