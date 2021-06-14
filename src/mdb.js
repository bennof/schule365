// Copyright (c) 2021 Benjamin Benno Falkner
const fs = require('fs');
const ADODB = require('node-adodb');
ADODB.debug = true;

const MDB_PAGE_SIZE = 4096;
const MDB_VER_JET3 = 0;
const MDB_VER_JET4 = 1;
const MDB_VER_ACCDB2007 = 0x02;
const MDB_VER_ACCDB2010 = 0x0103;

const JET3_XOR = [ 0x86,0xfb,0xec,0x37,0x5d,0x44,0x9c,0xfa,0xc6,
                   0x5e,0x28,0xe6,0x13,0xb6,0x8a,0x60,0x54,0x94];
const JET4_XOR = [ 0x6aba,0x37ec,0xd561,0xfa9c,0xcffa,
                   0xe628,0x272f,0x608a,0x0568,0x367b,
                   0xe3c9,0xb1df,0x654b,0x4313,0x3ef3,
                   0x33b1,0xf008,0x5b79,0x24ae,0x2a7c];

async function read_head(filen){
    return new Promise((resolve,reject) => {
        fs.open(filen, 'r', (status, fd) => {
            if (status) { reject(status)}
            else{
                let buffer = Buffer.alloc(MDB_PAGE_SIZE);
                fs.read(fd, buffer, 0, MDB_PAGE_SIZE, 0, function(err, num) {
                    resolve(buffer);
                });
            }
        });
    });
}



class Connection {
    constructor(filen, passwd) {
        this.db = ADODB.open(`Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${filen};Jet OLEDB:Database Password=${passwd};`);

    }

    query(sql){
        return new Promise((resolve,reject) => {
            this.db.query(sql).on('done',(data) => {resolve(data);});
        });   
    }
}


module.exports = {
    Connection
};