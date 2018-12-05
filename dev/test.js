const Blockchain = require('./blockchain');

const randomBlockchain = new Blockchain;
randomBlockchain.createNewBlock(3783, 'SDLFKN4JNSFDI9', '43OU5HEJFG943THGEH');
randomBlockchain.createNewBlock(345, 'DKLFN3489GBEFRI', 'LKDSNF48HBFIREGH9');
randomBlockchain.createNewBlock(2463, 'DSLGKN3P49TNFSPDK', 'EWKLN34905390HNKW');

console.log(randomBlockchain);