import pako from 'pako';

// Convert string to base64
export function strToBase64(str: string): string {
    return btoa(encodeURIComponent(str));
}

// Convert base64 to string
export function base64ToStr(base64: string): string {
    return decodeURIComponent(atob(base64));
}

// Generate encryption key from password and salt
async function getKey(password: string, salt: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    const saltData = encoder.encode(salt);
    
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordData,
        'PBKDF2',
        false,
        ['deriveKey']
    );
    
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: saltData,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

// Encrypt text
export async function encryptText(text: string, password: string, salt: string): Promise<string> {
    const key = await getKey(password, salt);
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    // Compress the data
    const compressed = pako.deflate(data);
    
    // Generate IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        key,
        compressed
    );
    
    // Combine IV and encrypted data
    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encrypted), iv.length);
    
    // Convert to base64
    return strToBase64(String.fromCharCode(...result));
}

// Decrypt text
export async function decryptText(encryptedBase64: string, password: string, salt: string): Promise<string> {
    const key = await getKey(password, salt);
    const decoder = new TextDecoder();
    
    // Convert from base64
    const encrypted = Uint8Array.from(base64ToStr(encryptedBase64), c => c.charCodeAt(0));
    
    // Extract IV
    const iv = encrypted.slice(0, 12);
    const data = encrypted.slice(12);
    
    const decrypted = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        key,
        data
    );
    
    // Decompress the data
    const decompressed = pako.inflate(new Uint8Array(decrypted));
    
    return decoder.decode(decompressed);
} 