const fs = require("fs");
const zlib = require('zlib');
const { Readable } = require("stream");

if(process.env['NODE_ENV'] === 'test') {
    console.log('function subArrays: test...')
    console.log(subArrays([1,2,3,4,5,6,7,3,4,10,1], [3, 4]).toString() == [2, 7].toString() ? 'Passed': 'Failed');

    console.log('function zip: test...')
    console.log(zip([1,2], [1,2]).toString() == [[1, 1],[2, 2]].toString() ? 'Passed': 'Failed');
    return 0; 
}

fs.readFile('test.pdf', (err, data) => {
    const startFlag = Buffer.from('\nstream');
    const endFlag = Buffer.from('\nendstream');
    const streamIndicies = subArrays(data, startFlag);
    const endStreamIndicies = subArrays(data, endFlag);
  
    const streamBlocks = zip(streamIndicies, endStreamIndicies);

    streamBlocks.forEach(([start, end], idx) => {
        const inflate = zlib.createInflate();

        const adjustedStartFlag = start + startFlag.length + 1; // we don't want to include any part of the 'stream' tag or the \n ending.
    
        const adjustedEndFlag = end; // we want to include \n

        const readable = Readable.from(data.slice(adjustedStartFlag, adjustedEndFlag));
        let writeStream = fs.createWriteStream(`new${idx}.png`);

        readable.pipe(inflate).pipe(writeStream);
    });
});

function zip(x, y) {
    return x.map((el, idx) => {
        return [el, y[idx]];
    });
}


function subArrays(arr, sub) {
    let indicies = [];
    let offset = 0;
    let i = 0;

    while(offset < arr.length) {
        if(arr[offset] === sub[i]) {
            while(offset+i < arr.length && i < sub.length && sub[i] === arr[offset+i]) {
                i++;
            }
            if(i === sub.length) {
                indicies.push(offset);
            }
            i = 0;
        }
        offset++;
    }
    return indicies;
}

