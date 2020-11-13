
// Import express
let express = require('express');
// Import Body parser
let bodyParser = require('body-parser');
// Import Path
var path = require('path');
// Initialize the app
let app = express();

const dotenv = require('dotenv');
dotenv.config();

// Import routes
let apiRoutes = require("./server/api-routes");
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Setup server port
var port = process.env.PORT || 8080;

// Use Api routes in the App
app.use('/api', apiRoutes);
// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running server on port " + port);
});

app.use(express.static('client'))

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'main.html'));
})