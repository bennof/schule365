const config = require('../src/config.js');
let cfg = {};
console.log('Checking Config ...');

console.log(`  Reading config file: `);
try{
    cfg = config.read();
    console.log(`\x1b[32m    success\x1b[0m`);
} catch(err) {
    console.error(`\x1b[31m    ERROR reading config\x1b[0m`);
    console.log(err);
}

console.log(`  Test Schild DB: `);
try{
    const mdb = require('../src/mdb.js');
    let db = new mdb.Connection(cfg.SchildNRW.path);
    console.log(`    ${cfg.SchildNRW.path} \x1b[32msuccess\x1b[0m`);
} catch(err) {
    console.error(`\x1b[31m    ERROR reading database\x1b[0m`);
    console.log(err);
}

console.log(`  Test Office365: `);
try{
    let cfg = config.read(); 
    console.log(`\x1b[32m    \x1b[0m`);
} catch(err) {
    console.error(`\x1b[31m    \x1b[0m`);
    console.log(err);
}