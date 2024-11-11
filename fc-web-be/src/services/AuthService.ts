import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET || 'default_secret';
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';

export class AuthService {
    public async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, saltRounds);
    }

    public async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    public generateToken(userId: string): string {
        return jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' });
    }

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
