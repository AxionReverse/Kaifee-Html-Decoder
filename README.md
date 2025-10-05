# Kaifee-Html-Decoder
Payload is emoji-mapped → Base64 → XOR → every-3rd-byte removed from a hex stream → ROT13 → reversed to obscure content. Result is encrypted with AES-GCM; the AES key is derived from an obfuscated token via PBKDF2 (200k iterations, SHA-256). Protected by Kaifee. Decoder: AxionReverse (Axion).
