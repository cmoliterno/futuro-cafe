import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'default_secret';
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';

export class AuthService {
    private saltRounds = 10;

    // Função para criar o hash da senha usando bcrypt
    public async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    // Função para comparar uma senha com seu hash usando bcrypt
    public async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    // Gera um token JWT sem expiração
    public generateToken(userId: string): string {
        return jwt.sign({ userId }, jwtSecret);
    }


    // Gera um token JWT de refresh com expiração mais longa (ex.: 7 dias)
    public generateRefreshToken(userId: string): string {
        return jwt.sign({ userId }, jwtRefreshSecret, { expiresIn: '7d' });
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

    // Verifica o refresh token e gera um novo token de acesso
    public refreshAccessToken(refreshToken: string): string | null {
        try {
            const decoded = jwt.verify(refreshToken, jwtRefreshSecret);
            const userId = (decoded as any).userId;
            return this.generateToken(userId); // Gera um novo token de acesso
        } catch (error) {
            console.error('Erro ao verificar o refresh token:', error);
            return null;
        }
    }
}
