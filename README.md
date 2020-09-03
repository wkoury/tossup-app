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
- [ ] Add basic authentication to admin page
- [ ] Create data component as parent to ```Admin``` and ```Game```
- [ ] Support multiple simultaneous instances
- [ ] Add toggle teams feature
- [ ] Improve handling of user disconnects
- [ ] Allow admins to remove players
- [ ] Add light mode and dark mode (be able to toggle them!)