const Blockchain = require('./blockchain');

const ephemerum = new Blockchain;

ephemerum.createNewBlock(49855, 'DSJF34U5RT349', '34095UB34345H');

ephemerum.createNewTransaction(100, 'ALEXU3434HBF4DSFJN', 'JENIH34T3948GB89GV');

ephemerum.createNewBlock(4920, 'LKDF94HTP4WIGH9W4', 'DNF483TGUBFG3498GT');

ephemerum.createNewTransaction(50, 'ALEXU3434HBF4DSFJN', 'JENIH34T3948GB89GV');
ephemerum.createNewTransaction(300, 'ALEXU3434HBF4DSFJN', 'JENIH34T3948GB89GV');
ephemerum.createNewTransaction(2000, 'ALEXU3434HBF4DSFJN', 'JENIH34T3948GB89GV');

ephemerum.createNewBlock(43467, 'DFN34058TH4GGH', '34098Y34509G3H4');

console.log(ephemerum.chain[2]);