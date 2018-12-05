const Blockchain = require('./blockchain');

const Ephemerum = new Blockchain;
Ephemerum.createNewBlock(3783, 'SDLFKN4JNSFDI9', '43OU5HEJFG943THGEH');
Ephemerum.createNewBlock(345, 'DKLFN3489GBEFRI', 'LKDSNF48HBFIREGH9');
Ephemerum.createNewBlock(2463, 'DSLGKN3P49TNFSPDK', 'EWKLN34905390HNKW');

console.log(Ephemerum);