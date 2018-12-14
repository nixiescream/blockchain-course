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
    const newTransaction = req.body;
    const blockIndex = ephemerum.addTransactionToPendingTransactions(newTransaction);
    res.json({note: `Transaction will be added in block ${blockIndex}.`});
});

app.post('/transaction/broadcast', (req, res) => {
    const newTransaction = ephemerum.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    ephemerum.addTransactionToPendingTransactions(newTransaction);

    const requestPromises = [];
    ephemerum.networkNodes.forEach(networkNodeURL => {
        const requestOptions = {
            uri: networkNodeURL + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
        .then(() => {
            res.json({note: 'Transaction created and broadcast successfully.'});
        });
});

app.get('/mine', (req, res) => {
    const lastBlock = ephemerum.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: ephemerum.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = ephemerum.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = ephemerum.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = ephemerum.createNewBlock(nonce, previousBlockHash, blockHash);

    const requestPromises = [];
    ephemerum.networkNodes.forEach(networkNodeURL => {
        const requestOptions = {
            uri: networkNodeURL + '/receive-new-block',
            method: 'POST',
            body: {newBlock},
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(() => {
        const requestOptions = {
            uri: ephemerum.currentNodeURL + '/transaction/broadcast',
            method: 'POST',
            body: {
                amount: 12.5,
                sender: '00',
                recipient: nodeAddress
            },
            json: true
        };

        return rp(requestOptions);
    })
    .then(() => {
        res.json({
            note: 'New block mined & broadcast successfully.',
            block: newBlock
        });
    });
});

app.post('/receive-new-block', (req, res) => {
    const newBlock = req.body.newBlock;
    const lastBlock = ephemerum.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

    if(correctHash && correctIndex) {
        ephemerum.chain.push(newBlock);
        ephemerum.pendingTransactions = [];
        res.json({
            note: `New block received and accepted.`,
            newBlock
        });
    } else {
        res.json({
            note: `New block rejected.`,
            newBlock
        });
    }
});

app.post('/register-and-broadcast-network', (req, res) => {
    const newNodeURL = req.body.newNodeURL;
    if(!ephemerum.networkNodes.includes(newNodeURL)) ephemerum.networkNodes.push(newNodeURL);

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
    const nodeNotAlreadyPresent = !ephemerum.networkNodes.includes(newNodeURL);
    const notCurrentNode = ephemerum.currentNodeURL !== newNodeURL;
    if(nodeNotAlreadyPresent && notCurrentNode) ephemerum.networkNodes.push(newNodeURL);
    res.json({ note: `New node registered successfully.` });
});

app.post('/register-nodes-bulk', (req, res) => {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeURL => {
        const nodeNotAlreadyPresent = !ephemerum.networkNodes.includes(networkNodeURL);
        const notCurrentNode = ephemerum.currentNodeURL !== networkNodeURL;
        if(nodeNotAlreadyPresent && notCurrentNode) ephemerum.networkNodes.push(networkNodeURL);
    });

    res.json({ note: `Bulk registration successful.` });
});

app.get('/consensus', (req, res) => {
    const requestPromises = [];
    ephemerum.networkNodes.forEach(networkNodeURL => {
        const requestOptions = {
            uri: networkNodeURL + '/blockchain',
            method: 'GET',
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(blockchains => {
        const currentChainLength = ephemerum.chain.length;
        let maxChainLength = currentChainLength;
        let newLongestChain = null;
        let newPendingTransactions = null;
        blockchains.forEach(blockchain => {
            if(blockchain.chain.length > maxChainLength) {
                maxChainLength = blockchain.chain.length;
                newLongestChain = blockchain.chain;
                newPendingTransactions = blockchain.pendingTransactions;
            };
        });

        if(!newLongestChain || (newLongestChain && !ephemerum.chainIsValid(newLongestChain))) {
            res.json({
                note: 'Current chain has not been replaced.',
                chain: ephemerum.chain
            });
        } else {
            ephemerum.chain = newLongestChain;
            ephemerum.pendingTransactions = newPendingTransactions;
            res.json({
                note: 'This chain has been replaced.',
                chain: ephemerum.chain
            });
        }
    });
});

app.get('/block/:blockHash', (req, res) => {
    const blockHash = req.params.blockHash;
    const correctBlock = ephemerum.getBlock(blockHash);
    res.json({
        block: correctBlock
    });
});

app.get('transaction/:transactionId', (req, res) => {

});

app.get('/address/:address', (req, res) => {

});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});