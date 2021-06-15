// Copyright (c) 2021 Benjamin Benno Falkner
'use strict';

const fs = require('fs');

function read(filen = __dirname+'/../priv/config.json'){
    // Check if file exists
    if(!fs.existsSync(filen)){
        let dir = require('path').dirname(filen);
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        write(empty(),filen);
    }
    
    let raw = fs.readFileSync(filen);
    return JSON.parse(raw);
}

function write(cfg, filen = __dirname+'/../priv/config.json'){
    let data = JSON.stringify(cfg);
    fs.writeFileSync(__dirname+'/../priv/config.json', data);
}

function empty(){
    return {
            "SchildNRW": {
                "path": ""
            },
            "Office365": {
                "tenant": "",
                "client_id": "",
                "scope": "",
                "client_assertion_type": "",
                "client_assertion": "",
                "grant_type": ""
            }
    }
}

module.exports = {
    read,
    write
}