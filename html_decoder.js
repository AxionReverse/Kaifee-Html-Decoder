// decoder.js
// Usage: node html_decoder.js <inputFile> <outputFile>
// developer @AxionReverse

const fs = require('fs');
const crypto = require('crypto');

function die(msg) { console.error(msg); process.exit(1); }

const argv = process.argv.slice(2);
if (argv.length !== 2) {
  console.log('Usage: node html_decoder.js <inputFile> <outputFile>');
  process.exit(0);
}

const inputPath = argv[0];
const outputPath = argv[1];

if (!fs.existsSync(inputPath)) die('Input file not found: ' + inputPath);

let html;
try {
  html = fs.readFileSync(inputPath, 'utf8');
} catch (e) {
  die('Failed to read input file: ' + e.message);
}

let payloadMatch = html.match(/<script[^>]*id=['"]payload['"][^>]*>([\s\S]*?)<\/script>/i);
let payload = payloadMatch ? payloadMatch[1].trim() : html.trim();
if (!payload) die('No payload found in input file.');

let autoToken;
const getKeyRe = /getKey\s*\(\s*(['"])(.*?)\1\s*\)/g;
let m;
while ((m = getKeyRe.exec(html)) !== null) autoToken = m[2];

let usedToken = autoToken;

function getKeyFromObf(obf) {
  try {
    const a = [...obf].map(c => String.fromCharCode(c.charCodeAt(0) - 3)).join('');
    const rev = a.split('').reverse().join('');
    return Buffer.from(rev, 'base64').toString('utf8');
  } catch (e) {
    return obf; 
  }
}

const keyStr = getKeyFromObf(usedToken);

try {
  payload = [...payload].map(c => String.fromCharCode((c.charCodeAt(0) - 1 + 256) % 256)).join('');
  payload = payload.replace(/XYZ/g, '');
  payload = payload.split('').reverse().join('');
} catch (e) {
  die('Processing payload failed: ' + e.message);
}

let decoded;
try {
  decoded = Buffer.from(payload, 'base64');
} catch (e) {
  die('Base64 decode failed: ' + e.message);
}
if (decoded.length < 44) die('Decoded payload too short');

const salt = decoded.slice(0, 16);
const iv = decoded.slice(16, 28);
const tag = decoded.slice(28, 44);
const ct = decoded.slice(44);

let derivedKey;
try {
  derivedKey = crypto.pbkdf2Sync(keyStr, salt, 200000, 32, 'sha256');
} catch (e) {
  die('PBKDF2 derive failed: ' + e.message);
}

try {
  const decipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ct), decipher.final()]);
  fs.writeFileSync(outputPath, plain);

  console.log('Decryption successful :  ' + outputPath);
  console.log('Key Used For Protect This File:  ' + keyStr);
} catch (e) {
  die('Decryption failed: ' + e.message);
}