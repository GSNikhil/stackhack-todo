const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(
    express.static( __dirname + "/dist/ngstackhack")
);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + 'dist/ngstackhack/index.html'));
})

app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
    console.log('Connected!')
});