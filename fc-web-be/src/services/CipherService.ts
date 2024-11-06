import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = process.env.CIPHER_SECRET_KEY || 'default_secret_key';
const saltSize = 32;
const keySize = 32; // Key size in bytes (256 bits)
const ivSize = 16;
const iterations = 1000;

export class CipherService {
    // Gera um salt seguro de 256 bits
    private generateSalt(): Buffer {
        return crypto.randomBytes(saltSize);
    }

    // Criptografa um texto
    public encrypt(plainText: string): string {
        const salt = this.generateSalt();
        const key = crypto.pbkdf2Sync(secretKey, salt, iterations, keySize, 'sha512');
        const iv = crypto.pbkdf2Sync(secretKey, salt, iterations, ivSize, 'sha512');
        
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);

        return Buffer.concat([salt, encrypted]).toString('base64');
    }

    // Decriptografa um texto
    public decrypt(cipherText: string): string {
        const allBytes = Buffer.from(cipherText, 'base64');
        const salt = allBytes.slice(0, saltSize);
        const encryptedText = allBytes.slice(saltSize);
        
        const key = crypto.pbkdf2Sync(secretKey, salt, iterations, keySize, 'sha512');
        const iv = crypto.pbkdf2Sync(secretKey, salt, iterations, ivSize, 'sha512');
        
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

        return decrypted.toString('utf8');
    }

    // Gera uma senha aleatória com caracteres permitidos
    public createPassword(length: number): string {
        const validCharacters = process.env.PASSWORD_CHAR_SET || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length }, () => validCharacters.charAt(Math.floor(Math.random() * validCharacters.length))).join('');
    }
}
