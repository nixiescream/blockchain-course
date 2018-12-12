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
    const blockIndex = ephemerum.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({note: `Transaction will be added in block ${blockIndex}.`});
});

app.get('/mine', (req, res) => {
    
});

app.listen(3000, () => {
    console.log('Listening on port 3000...');
});