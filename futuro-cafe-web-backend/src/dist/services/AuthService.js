"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    constructor() {
        this.secret = process.env.JWT_SECRET || 'defaultSecret';
    }
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, this.secret, { expiresIn: '1h' });
    }
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.secret);
        }
        catch (err) {
            throw new Error('Invalid token');
        }
    }
}
exports.AuthService = AuthService;
