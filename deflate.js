// Node.js program to demonstrate the	 
// createDeflate() method 

// Including zlib and fs module 
const zlib = require("zlib"); 
const fs = require('fs'); 

// Creating readable Stream 
const inp = fs.createReadStream('input.txt'); 

// Creating writable stream 
const out = fs.createWriteStream('input.txt.gz'); 

// Calling createDeflate method 
const def = zlib.createDeflate(); 

// Piping 
inp.pipe(def).pipe(out); 
console.log("Program Completed!"); 
