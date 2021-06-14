const MDB_PAGE_SIZE = 4096;
const MDB_VER_JET3 = 0;
const MDB_VER_JET4 = 1;
const MDB_VER_ACCDB2007 = 0x02;
const MDB_VER_ACCDB2010 = 0x0103;

const JET3_XOR = Uint8Array.from([ 0x86,0xfb,0xec,0x37,0x5d,0x44,0x9c,0xfa,0xc6,
                                   0x5e,0x28,0xe6,0x13,0xb6,0x8a,0x60,0x54,0x94]);


const JET4_XOR = Uint16Array.from([ 0x6aba,0x37ec,0xd561,0xfa9c,0xcffa,
                                    0xe628,0x272f,0x608a,0x0568,0x367b,
                                    0xe3c9,0xb1df,0x654b,0x4313,0x3ef3,
                                    0x33b1,0xf008,0x5b79,0x24ae,0x2a7c]);

function scanMDBPage(buffer){
    const view = new DataView(buffer);

    // check page id 
    if(view.getUint8(0)!=0)
        throw `ERROR no valid db [${view.getUint8(0)}]`;
    
    // version
    const version = view.getInt32(0x14,true);

    // extract password
    let password = "";
    if( version == MDB_VER_JET4 ){
        let magic = view.getUint16(0x66,true) ^ JET4_XOR[18];
        for(let i = 0; i<20; i += 1 ){
            let h = view.getUint16(0x42+i*2,true) ^ JET4_XOR[i];
            if ( h > 255 )
                h ^= magic;
            if(h==0) break;
            password += String.fromCharCode(h);
        }
    }
    else if (version == MDB_VER_JET3) {
        for(let i = 0; i<20; i += 1 ){
            let h = view.getUint8(0x42+i,true) ^ JET3_XOR[i];
            if(h==0) break;
            password += String.fromCharCode(h);
        }
    }
    
    return {
        version: version,
        password: password
    }
}

async function njs_read(filen){
    return new Promise((resolve,reject) => {
        const fs = require('fs');
        fs.open(filen,'r', (status, fd) => {
            if(status) 
                reject(status);
            let buffer = Buffer.alloc(MDB_PAGE_SIZE);
            fs.read(fd, buffer, 0, MDB_PAGE_SIZE, 0, function(err, num) {
                if (err) 
                    reject(err);
                resolve(buffer);
            });
        });
    });
}

async function js_read(event){
    let file = event.target.files[0];
    if(!file)
        throw "ERROR: no file"
    return new Promise((resolve,reject) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        reader.onerror = (e) => {
            reject(reader.error);
        }
        reader.readAsArrayBuffer(file.slice(0,MDB_PAGE_SIZE));
    });
}



//(async () => {
//    try {
//        let page = await njs_read('./SCHILD2000n.mdb');
//        let info = scanMDBPage(page.buffer);
//        console.log(info);
//    } catch(e) {
//        console.error(e);
//    }
//})();