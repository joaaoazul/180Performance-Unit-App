// src/pages/auth/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { login } from '../../services/authService';
import { AuthContext } from '../../components/context/AuthContext';
import backgroundImage from '../../assets/backgroundImage.JPG'; // Você precisará adicionar esta imagem

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: white;
  position: relative;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ImageSection = styled.div`
  flex: 1.2;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  position: relative;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.7) 0%, rgba(14, 116, 144, 0.7) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 40px;
`;

const MotivationalText = styled.h2`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 20px;
  max-width: 500px;
  text-align: center;
  line-height: 1.3;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const SubText = styled.p`
  font-size: 18px;
  max-width: 500px;
  text-align: center;
  opacity: 0.9;
`;

const Logo = styled.div`
  position: absolute;
  top: 40px;
  left: 40px;
  font-size: 24px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
`;

const LogoIcon = styled.div`
  background: white;
  color: #10B981;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-weight: 800;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
`;

const FormHeader = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const FormTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 10px;
`;

const FormSubtitle = styled.p`
  color: #64748B;
  font-size: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px 12px 40px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  background: #F8FAFC;
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #10B981;
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94A3B8;
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94A3B8;
  cursor: pointer;
`;

const RememberRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
`;

const CheckboxInput = styled.input`
  margin-right: 8px;
`;

const ForgotPassword = styled.a`
  color: #10B981;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background: #10B981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 20px;
  
  &:hover {
    background: #0D9668;
  }
  
  &:disabled {
    background: #94A3B8;
    cursor: not-allowed;
  }
`;

const SignupRow = styled.div`
  text-align: center;
  font-size: 14px;
  color: #64748B;
`;

const SignupLink = styled.a`
  color: #10B981;
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: #FEE2E2;
  color: #EF4444;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Usar seu método de login existente
      const response = await login(email, password);
      
      // Usar seu context para autenticação
      loginUser(response.token, { 
        name: response.name || 'Personal Trainer', 
        email 
      });
      
      // Redirecionar para o dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Falha na autenticação. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <PageContainer>
      <FormSection>
        <FormContainer>
          <FormHeader>
            <FormTitle>Bem-vindo de volta! 👋</FormTitle>
            <FormSubtitle>Entre para acessar sua conta de personal trainer</FormSubtitle>
          </FormHeader>
          
          {error && (
            <ErrorMessage>{error}</ErrorMessage>
          )}
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <InputLabel htmlFor="email">Email</InputLabel>
              <InputWrapper>
                <InputIcon><FiUser /></InputIcon>
                <Input 
                  type="email" 
                  id="email" 
                  placeholder="seu@email.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputWrapper>
            </FormGroup>
            
            <FormGroup>
              <InputLabel htmlFor="password">Senha</InputLabel>
              <InputWrapper>
                <InputIcon><FiLock /></InputIcon>
                <Input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  placeholder="Sua senha" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <EyeIcon onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </EyeIcon>
              </InputWrapper>
            </FormGroup>
            
            <RememberRow>
              <Checkbox>
                <CheckboxInput 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="remember">Lembrar de mim</label>
              </Checkbox>
              
              <ForgotPassword href="/forgot-password">Esqueceu a senha?</ForgotPassword>
            </RememberRow>
            
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </SubmitButton>
            
            <SignupRow>
              Ainda não tem uma conta? <SignupLink href="/register">Cadastre-se</SignupLink>
            </SignupRow>
          </form>
        </FormContainer>
      </FormSection>
      
      <ImageSection>
        <Overlay>
          <Logo>
            <LogoIcon>F</LogoIcon>
            FitPro Coach
          </Logo>
          <MotivationalText>
            Transforme a vida de seus atletas com uma plataforma completa
          </MotivationalText>
          <SubText>
            Gerencie treinos, acompanhe resultados e inspire seus atletas a alcançarem o máximo potencial
          </SubText>
        </Overlay>
      </ImageSection>
    </PageContainer>
  );
};

export default Login;