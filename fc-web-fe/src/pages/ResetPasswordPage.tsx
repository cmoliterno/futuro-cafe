import React, { useState } from 'react';
import api from '../services/api'; // Serviço de API configurado

const ResetPasswordPage = ({ match }: any) => {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = async () => {
        try {
            const { token } = match.params; // O token estará na URL, por exemplo: /reset-password/:token
            const response = await api.resetPassword({ token, newPassword });
            setMessage('Sua senha foi redefinida com sucesso!');
            setError(''); // Limpa mensagens de erro, se houver
        } catch (err) {
            setError('Erro ao redefinir a senha. Verifique o token ou tente novamente.');
            setMessage(''); // Limpa mensagens de sucesso, se houver
        }
    };

    return (
        <div>
            <h1>Redefinir Senha</h1>
            <input
                type="password"
                placeholder="Nova Senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleResetPassword}>Redefinir Senha</button>
        </div>
    );
};

export default ResetPasswordPage;
