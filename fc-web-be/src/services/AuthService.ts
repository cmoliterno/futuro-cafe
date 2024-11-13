import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'default_secret';
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';

export class AuthService {
    private saltRounds = 10;

    // Função para criar um salt de 256 bits e convertê-lo para Base64
    public generateSalt(): string {
        const salt = crypto.randomBytes(32); // 32 bytes = 256 bits
        return salt.toString('base64');
    }

    // Função para criar o hash da senha usando PBKDF2 com SHA-1
    public hashPassword(password: string, salt: string): string {
        return crypto.pbkdf2Sync(password, Buffer.from(salt, 'base64'), 1000, 32, 'sha1').toString('base64');
    }

    // Função para comparar uma senha com seu hash
    public comparePassword(password: string, salt: string, hash: string): boolean {
        const hashedPassword = this.hashPassword(password, salt);
        return hashedPassword === hash;
    }

    // Gera um token JWT com expiração compatível com o sistema legado
    public generateToken(userId: string): string {
        return jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' });
    }

    // Verifica o token de acesso
    public verifyToken(token: string): { userId: string } | null {
        try {
            return jwt.verify(token, jwtSecret) as { userId: string };
        } catch (error) {
            console.error('Token inválido ou expirado');
            return null;
        }
    }

    // Função para gerar um novo access token usando o refresh token
    public refreshAccessToken(refreshToken: string): string | null {
        try {
            const decoded = jwt.verify(refreshToken, jwtRefreshSecret);
            const userId = (decoded as any).userId;
            return this.generateToken(userId);
        } catch (error) {
            console.error('Erro ao verificar o refresh token:', error);
            return null;
        }
    }
}
