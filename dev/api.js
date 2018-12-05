const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');

const ephemerum = new Blockchain;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/blockchain', (req, res) => {
    res.send(ephemerum);
});

app.post('/transaction', (req, res) => {
    console.log(req.body);
    res.send(`The amount of this transaction is ${req.body.amount} EPH`);
});

app.get('/mine', (req, res) => {
    
});

app.listen(3000, () => {
    console.log('Listening on port 3000...');
});