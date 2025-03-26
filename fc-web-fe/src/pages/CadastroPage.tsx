import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {Link, useNavigate} from 'react-router-dom'; // Importando o hook para navegação
import api from '../services/api'; // Importando o serviço de API

const CadastroContainer = styled.div`
  padding: 30px;
  background-color: #fff;
  max-width: 450px;
  margin: auto;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h1`
  color: #047502;
  text-align: center;
  margin-bottom: 25px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 12px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #047502;
    outline: none;
  }
  
  &.error {
    border-color: #e74c3c;
  }
`;

const Button = styled.button`
  padding: 12px;
  width: 100%;
  background-color: #047502;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s;
  margin-top: 20px;
  
  &:hover {
    background-color: #035f02;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
  text-align: left;
`;

const SuccessMessage = styled.p`
  color: #2ecc71;
  text-align: center;
  font-weight: bold;
  margin-top: 10px;
`;

const Description = styled.p`
  color: #666;
  padding-top: 10%;
  text-align: center;
  font-size: 14px;
`;

const PolicyLink = styled(Link)`
  color: #047502;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

// Validação de CPF
const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = sum % 11;
    let digit = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cpf.charAt(9)) !== digit) return false;
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = sum % 11;
    digit = remainder < 2 ? 0 : 11 - remainder;
    
    return parseInt(cpf.charAt(10)) === digit;
};

// Validação de email
const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const CadastroPage: React.FC = () => {
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [cpf, setCpf] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // Usando o hook de navegação

    // Limpa mensagens de erro quando o usuário modifica um campo
    useEffect(() => {
        const newErrors = { ...errors };
        if (nomeCompleto && 'nomeCompleto' in errors) delete newErrors.nomeCompleto;
        if (email && validateEmail(email) && 'email' in errors) delete newErrors.email;
        if (password && password.length >= 6 && 'password' in errors) delete newErrors.password;
        if (confirmPassword && confirmPassword === password && 'confirmPassword' in errors) delete newErrors.confirmPassword;
        if (cpf && validateCPF(cpf) && 'cpf' in errors) delete newErrors.cpf;
        if ('general' in errors) delete newErrors.general; // Limpar erro geral ao modificar qualquer campo
        setErrors(newErrors);
    }, [nomeCompleto, email, password, confirmPassword, cpf]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        
        if (!nomeCompleto.trim()) newErrors.nomeCompleto = 'Nome completo é obrigatório';
        
        if (!email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Email inválido';
        }
        
        if (!password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (password.length < 6) {
            newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
        }
        
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'As senhas não conferem';
        }
        
        if (!cpf.trim()) {
            newErrors.cpf = 'CPF é obrigatório';
        } else if (!validateCPF(cpf)) {
            newErrors.cpf = 'CPF inválido';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;
        
        setLoading(true);
        setSuccess('');
        setErrors({}); // Limpar todos os erros anteriores ao tentar cadastrar
        
        try {
            await api.registerUser({
                nomeCompleto,
                email,
                password,
                cpf: cpf.replace(/[^\d]/g, ''),
            });

            setSuccess('Cadastro realizado com sucesso! Redirecionando...');
            
            // Limpa o formulário
            setNomeCompleto('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setCpf('');
            
            // Redireciona para a tela de login após 2 segundos
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Houve um problema ao fazer o cadastro. Tente novamente.';
            
            // Tratamento específico para erros comuns
            if (errorMessage.includes('email')) {
                setErrors({ ...errors, email: 'Este email já está em uso' });
            } else if (errorMessage.includes('CPF')) {
                setErrors({ ...errors, cpf: 'Este CPF já está cadastrado' });
            } else {
                setErrors({ ...errors, general: errorMessage });
            }
        } finally {
            setLoading(false);
        }
    };

    const formatCPF = (value: string) => {
        const digits = value.replace(/\D/g, '');
        let formatted = '';
        
        if (digits.length > 0) formatted += digits.substring(0, Math.min(3, digits.length));
        if (digits.length > 3) formatted += '.' + digits.substring(3, Math.min(6, digits.length));
        if (digits.length > 6) formatted += '.' + digits.substring(6, Math.min(9, digits.length));
        if (digits.length > 9) formatted += '-' + digits.substring(9, Math.min(11, digits.length));
        
        return formatted;
    };

    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedCPF = formatCPF(e.target.value);
        setCpf(formattedCPF);
    };

    return (
        <CadastroContainer>
            <Title>Cadastro</Title>
            
            <FormGroup>
                <Label htmlFor="nomeCompleto">Nome Completo</Label>
                <Input
                    id="nomeCompleto"
                    type="text"
                    value={nomeCompleto}
                    onChange={(e) => setNomeCompleto(e.target.value)}
                    className={errors.nomeCompleto ? 'error' : ''}
                />
                {errors.nomeCompleto && <ErrorMessage>{errors.nomeCompleto}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? 'error' : ''}
                />
                {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
                <Label htmlFor="password">Senha</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? 'error' : ''}
                />
                {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
                <Label htmlFor="confirmPassword">Confirme a Senha</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                    id="cpf"
                    type="text"
                    value={cpf}
                    onChange={handleCPFChange}
                    maxLength={14}
                    className={errors.cpf ? 'error' : ''}
                />
                {errors.cpf && <ErrorMessage>{errors.cpf}</ErrorMessage>}
            </FormGroup>
            
            {errors.general && <ErrorMessage>{errors.general}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
            
            <Button 
                onClick={handleRegister} 
                disabled={loading}
            >
                {loading ? 'Processando...' : 'Cadastrar'}
            </Button>

            <Description>
                Já possui uma conta? <PolicyLink to="/login">Faça login</PolicyLink>
            </Description>
            
            <Description>
                Para mais informações, consulte nossa <PolicyLink to="/politica-de-privacidade">Política de Privacidade</PolicyLink>.
            </Description>
        </CadastroContainer>
    );
};

export default CadastroPage;
