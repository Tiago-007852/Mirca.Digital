import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Lock, Mail, Key, Sparkles, HelpCircle, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      let errMsg = 'Falha no início de sessão. Verifique as suas credenciais.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errMsg = 'E-mail ou palavra-passe incorretos.';
      } else if (err.code === 'auth/invalid-credential') {
        errMsg = 'Credenciais inválidas. Verifique os dados digitados.';
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/unauthorized-email') {
        setError(err.message);
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError('Erro ao iniciar sessão com o Google. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setError('Por favor, digite o seu correio eletrónico.');
      return;
    }
    setError('');
    setMessage('');
    setResetLoading(true);
    try {
      await resetPassword(resetEmail);
      setMessage('E-mail de recuperação de palavra-passe enviado com sucesso!');
      setShowForgotModal(false);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao enviar e-mail de recuperação. Verifique o endereço digitado.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 pt-14 rounded-3xl border border-gray-100 shadow-xl space-y-6 relative">
        
        {/* Voltar ao site principal */}
        <Link 
          to="/" 
          className="absolute top-5 left-5 flex items-center gap-1.5 text-gray-400 hover:text-[#FF6B00] hover:border-orange-200/50 hover:bg-orange-50/50 transition-all group text-[10px] font-bold uppercase tracking-wider font-sans bg-slate-50/80 px-3 py-1.5 rounded-xl border border-gray-100/70"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Voltar ao Site</span>
        </Link>

        {/* Title branding */}
        <div className="text-center space-y-2 pt-2">
          <span className="bg-[#FF6B00] text-white p-3.5 rounded-2xl font-black text-xl leading-none inline-block shadow-lg">
            M
          </span>
          <h1 className="font-extrabold text-[#202A50] text-2xl tracking-tight leading-tight pt-2">Área Administrativa</h1>
          <p className="text-xs text-gray-400">Entre na plataforma de controlo de orçamentos e inventário de Angola.</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 border border-rose-100 p-3.5 rounded-xl text-center text-xs font-semibold">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 p-3.5 rounded-xl text-center text-xs font-semibold">
            {message}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-sans">Correio Eletrónico</label>
            <div className="relative">
              <input 
                type="email" 
                required
                placeholder="Ex: admin@mirca.digital" 
                className="w-full text-xs font-semibold px-4 py-3 pl-11 rounded-xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#FF6B00] focus:bg-white text-[#000000]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-sans">Palavra-passe</label>
              <button 
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[10px] font-bold text-[#FF6B00] hover:underline uppercase tracking-widest block font-sans"
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <input 
                type="password" 
                required
                placeholder="Digite a sua senha..." 
                className="w-full text-xs font-semibold px-4 py-3 pl-11 rounded-xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#FF6B00] focus:bg-white text-[#000000]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Key className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B00] hover:bg-[#202A50] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {loading ? 'A processar...' : 'Iniciar Sessão'}
            </button>
          </div>
        </form>

        {/* GOOGLE CONTINUATION TRIGGER */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase font-bold tracking-widest font-sans">Ou continue com</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full border border-gray-200 hover:border-[#FF6B00] bg-white hover:bg-slate-55/10 text-gray-700 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Entrar com o Google
          </button>
        </div>

      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-gray-100 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-orange-100 p-2 rounded-lg text-[#FF6B00]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-[#202A50]">Recuperar Palavra-passe</h3>
            </div>
            
            <p className="text-xs text-gray-500 leading-relaxed">
              Digite o seu endereço de correio eletrónico associado à sua conta. Enviaremos um link de redefinição seguro de imediato.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input 
                type="email" 
                required
                placeholder="Ex: seu-email@mirca.digital" 
                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:border-[#FF6B00] focus:bg-white text-[#000000]"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-1/2 border border-gray-200 text-gray-500 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-1/2 bg-[#FF6B00] hover:bg-[#202A50] text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center disabled:opacity-50"
                >
                  {resetLoading ? 'A enviar...' : 'Enviar Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
