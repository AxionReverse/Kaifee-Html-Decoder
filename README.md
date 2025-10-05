# Kaifee-Html-Decoder
Payload is emoji-mapped → Base64 → XOR → every-3rd-byte removed from a hex stream → ROT13 → reversed to obscure content. Result is encrypted with AES-GCM; the AES key is derived from an obfuscated token via PBKDF2 (200k iterations, SHA-256). Protected by Kaifee. Decoder: AxionReverse (Axion).

<div align="center">
  <h1 style="font-size:24px; color:#FF6719; text-shadow:2px 2px 4px rgba(0,0,0,0.5);">Decoder</h1>
</div>

### Original code
![Original code](https://raw.githubusercontent.com/AxionReverse/Kaifee-Html-Decoder/main/original.png)

*This image shows the original source*

### Protected code
![Original code](https://raw.githubusercontent.com/AxionReverse/Kaifee-Html-Decoder/main/protected.png)

*This image shows the protected source*

```bash

## Installation Decoder (Termux / Android)

Open Termux and run:

# update & upgrade
apt update && apt upgrade 

# install Node.js
pkg install nodejs

# give storage permission
termux-setup-storage

# usages
node html_decoder.js <inputFile.js> <outputFile.js>

