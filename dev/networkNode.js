const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');

const nodeAddress = uuid().split('-').join('');

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
    const lastBlock = ephemerum.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transaction: ephemerum.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = ephemerum.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = ephemerum.hashBlock(previousBlockHash, currentBlockData, nonce);

    ephemerum.createNewTransaction(12.5, '00', nodeAddress);

    const newBlock = ephemerum.createNewBlock(nonce, previousBlockHash, blockHash);
    res.json({
        note: 'New block mined successfully.',
        block: newBlock
    });
});

app.post('/register-and-broadcast-network', (req, res) => {
    const newNodeURL = req.body.newNodeURL;
    if(ephemerum.networkNodes.indexOf(newNodeURL) === -1) ephemerum.networkNodes.push(newNodeURL);

    const regNodesPromises = [];
    ephemerum.networkNodes.forEach(networkNodeURL => {
        const requestOptions = {
            uri: networkNodeURL + '/register-node',
            method: 'POST',
            body: { newNodeURL },
            json: true
        };

        regNodesPromises.push(rp(requestOptions));
    });

    Promise.all(regNodesPromises)
        .then(() => {
            const bulkRegisterOptions = {
                uri: newNodeURL + '/register-nodes-bulk',
                method: 'POST',
                body: { allNetworkNodes: [...ephemerum.networkNodes, ephemerum.currentNodeURL] },
                json: true
            };

            return rp(bulkRegisterOptions);
        })
        .then(() => {
            res.json({ note: `New node registered with network successfully.` });
        });
});

app.post('/register-node', (req, res) => {
    const newNodeURL = req.body.newNodeURL;
    const nodeNotAlreadyPresent = ephemerum.networkNodes.indexOf(newNodeURL) === -1;
    const notCurrentNode = ephemerum.currentNodeURL !== newNodeURL;
    if(nodeNotAlreadyPresent && notCurrentNode) ephemerum.networkNodes.push(newNodeURL);
    res.json({ note: `New node registered successfully.` });
});

app.post('/register-nodes-bulk', (req, res) => {

});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});