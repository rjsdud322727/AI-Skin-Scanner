'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import ScannerLogo from '@/components/ScannerLogo';

const LoginPage = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleLogin = async () => {
    setIsLoading(true);
    
    // 로딩 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="app-container">
      <div className="page-container">
        
        {/* 헤더 */}
        <div className="header">
          <button onClick={handleBack} className="header-back">
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="page-content">
          
          {/* 로고 섹션 */}
          <div className="logo text-center animate-scale-in" style={{ marginBottom: 'var(--space-2xl)' }}>
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <ScannerLogo size={100} />
            </div>
            <h1 className="logo-text" style={{ 
              fontSize: 'var(--text-3xl)',
              fontWeight: '400',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.05em',
              marginBottom: 'var(--space-sm)'
            }}>
              Skancer
            </h1>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--text-secondary)',
              fontWeight: '500'
            }}>
              로그인하여 시작하세요
            </p>
          </div>

          {/* 로그인 폼 */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            
            {/* 이메일 입력 */}
            <div className="form-group mb-lg">
              <div className="input-with-icon">
                <div style={{
                  position: 'absolute',
                  left: 'var(--space-md)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                  zIndex: 1
                }}>
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소"
                  className="input"
                  style={{ 
                    paddingLeft: '3.5rem',
                    fontSize: 'var(--text-base)',
                    minHeight: '64px'
                  }}
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className="form-group mb-xl">
              <div className="input-with-icon">
                <div style={{
                  position: 'absolute',
                  left: 'var(--space-md)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                  zIndex: 1
                }}>
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  className="input"
                  style={{ 
                    paddingLeft: '3.5rem',
                    paddingRight: '3.5rem',
                    fontSize: 'var(--text-base)',
                    minHeight: '64px'
                  }}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="input-icon"
                  style={{
                    right: 'var(--space-md)',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* 로그인 버튼 */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="btn btn-primary w-full"
              style={{
                minHeight: '64px',
                fontSize: 'var(--text-lg)',
                fontWeight: '600'
              }}
            >
              {isLoading ? (
                <div className="loading-spinner" />
              ) : (
                '로그인'
              )}
            </button>

          </div>

          {/* 하단 링크 */}
          <div className="text-center animate-fade-in" style={{ 
            animationDelay: '0.6s',
            marginTop: 'auto',
            paddingBottom: 'var(--space-xl)'
          }}>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--text-secondary)'
            }}>
              계정이 없으신가요?{' '}
              <button
                onClick={() => router.push('/auth/register')}
                style={{
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  fontWeight: '600',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                회원가입
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage; 