import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { signInWithGoogle, signIn, signUp, isLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
      // Redirect will happen via Supabase auth state listener
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google ile giriş yapılamadı');
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);

      if (isSignUp) {
        await signUp(email, password);
        setError('Hesap oluşturuldu! Lütfen e-posta adresinizi onaylayın.');
        setEmail('');
        setPassword('');
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'İşlem başarısız');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>FirmaScope</h1>
        <p>Hoş geldiniz</p>

        {error && (
          <div className={`error-message ${error.includes('onaylayın') ? 'success' : 'error'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSignIn} className="login-form">
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'İşleniyor...' : isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>

          <div className="toggle-signup">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              disabled={isLoading}
            >
              {isSignUp
                ? 'Zaten hesabım var, giriş yapmak istiyorum'
                : 'Hesabım yok, kayıt olmak istiyorum'}
            </button>
          </div>
        </form>

        <div className="divider">VEYA</div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="google-button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {isLoading ? 'İşleniyor...' : 'Google ile Giriş Yap'}
        </button>
      </div>

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, sans-serif;
        }

        .login-card {
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          text-align: center;
          width: 100%;
          max-width: 400px;
        }

        .login-card h1 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
          font-weight: 700;
        }

        .login-card p {
          color: #666;
          margin: 0 0 30px 0;
          font-size: 14px;
        }

        .error-message {
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 13px;
          line-height: 1.4;
        }

        .error-message.error {
          background-color: #fee;
          color: #c33;
          border: 1px solid #fcc;
        }

        .error-message.success {
          background-color: #efe;
          color: #3c3;
          border: 1px solid #cfc;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin: 20px 0;
        }

        .login-form input {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .login-form input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .login-form input:disabled {
          background-color: #f5f5f5;
          color: #999;
        }

        .login-form button[type='submit'] {
          padding: 12px;
          background-color: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .login-form button[type='submit']:hover:not(:disabled) {
          background-color: #5568d3;
        }

        .login-form button[type='submit']:disabled {
          background-color: #999;
          cursor: not-allowed;
        }

        .toggle-signup {
          margin-top: 8px;
        }

        .toggle-signup button {
          background: none;
          border: none;
          color: #667eea;
          cursor: pointer;
          font-size: 12px;
          text-decoration: underline;
          padding: 0;
          font-family: inherit;
        }

        .toggle-signup button:hover:not(:disabled) {
          color: #5568d3;
        }

        .toggle-signup button:disabled {
          color: #999;
          cursor: not-allowed;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 25px 0 15px 0;
          color: #999;
          font-size: 12px;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background-color: #ddd;
        }

        .google-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px;
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .google-button:hover:not(:disabled) {
          background-color: #f9f9f9;
          border-color: #999;
        }

        .google-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
