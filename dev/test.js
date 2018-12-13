const Blockchain = require('./blockchain');
const ephemerum = new Blockchain;

const bc1 = {
    chain: [
    {
    index: 1,
    timestamp: 1544712836628,
    transactions: [ ],
    nonce: 93833,
    hash: "0",
    previousBlockHash: "0"
    },
    {
    index: 2,
    timestamp: 1544712864296,
    transactions: [
    {
    amount: 70,
    sender: "2ERUH23HR0293TH",
    recipient: "FJWDGN48573985WNFDBWJFND",
    transactionId: "f8272bd0fee611e8bc6b37c77c6cc5ae"
    },
    {
    amount: 70,
    sender: "2ERUH23HR0293TH",
    recipient: "FJWDGN48573985WNFDBWJFND",
    transactionId: "f8a3d5e0fee611e8bc6b37c77c6cc5ae"
    }
    ],
    nonce: 21512,
    hash: "000059ed0aa3b7bebc2c49fdf7ccca48ff3eb512046af40d0d0938e921902904",
    previousBlockHash: "0"
    },
    {
    index: 3,
    timestamp: 1544712887639,
    transactions: [
    {
    amount: 12.5,
    sender: "00",
    recipient: "ea938630fee611e8bc6b37c77c6cc5ae",
    transactionId: "fb130120fee611e8bc6b37c77c6cc5ae"
    },
    {
    amount: 70,
    sender: "2ERUH23HR0293TH",
    recipient: "FJWDGN48573985WNFDBWJFND",
    transactionId: "012d5a10fee711e8bc6b37c77c6cc5ae"
    },
    {
    amount: 700,
    sender: "2ERUH23HR0293TH",
    recipient: "FJWDGN48573985WNFDBWJFND",
    transactionId: "049f9d70fee711e8bc6b37c77c6cc5ae"
    },
    {
    amount: 200,
    sender: "2ERUH23HR0293TH",
    recipient: "FJWDGN48573985WNFDBWJFND",
    transactionId: "07238930fee711e8bc6b37c77c6cc5ae"
    }
    ],
    nonce: 82995,
    hash: "0000a0de2c01da3e6d0e0129977be7a8c79f4732c0d1b77274689966cc0d9ab7",
    previousBlockHash: "000059ed0aa3b7bebc2c49fdf7ccca48ff3eb512046af40d0d0938e921902904"
    }
    ],
    pendingTransactions: [
    {
    amount: 12.5,
    sender: "00",
    recipient: "ea938630fee611e8bc6b37c77c6cc5ae",
    transactionId: "08fba490fee711e8bc6b37c77c6cc5ae"
    }
    ],
    currentNodeURL: "http://localhost:3001",
    networkNodes: [ ]
    }

console.log('Valid: ', ephemerum.chainIsValid(bc1.chain));
