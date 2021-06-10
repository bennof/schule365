const config = require('../src/config.js');

console.log('Checking Config ...');

console.log(`  Reading config file: `);
try{
    let cfg = config.read();
    console.log(`\x1b[32m    success\x1b[0m`);
} catch(err) {
    console.error(`\x1b[31m    \x1b[0m`);
    console.log(err);
}

console.log(`  Test Schild DB: `);
try{
    let cfg = config.read(); 
    console.log(`\x1b[32m    \x1b[0m`);
} catch(err) {
    console.error(`\x1b[31m    \x1b[0m`);
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