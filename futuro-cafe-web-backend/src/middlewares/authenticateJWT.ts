import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido' });
    }

    const decoded = authService.verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }

    // Passa o userId para o próximo middleware
    req.headers.userId = decoded.userId;
    next();
};
