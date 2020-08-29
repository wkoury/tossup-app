const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);

const port = process.env.PORT || 8085;

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/ping', function (req, res) {
    return res.send('Backend connected!');
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

server.listen(port, () => {
    console.log(`Server running on port ${port}.`)
});
