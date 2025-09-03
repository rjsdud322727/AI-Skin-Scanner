'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, LogIn } from 'lucide-react';
import ScannerLogo from '@/components/ScannerLogo';

const AuthSelectPage = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleRegister = () => {
    router.push('/auth/register');
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

        <div className="page-content text-center">
          
          {/* 로고 섹션 */}
          <div className="logo animate-scale-in" style={{ marginBottom: 'var(--space-2xl)' }}>
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <ScannerLogo size={140} />
            </div>
            <h1 className="logo-text" style={{ 
              fontSize: 'var(--text-4xl)',
              fontWeight: '400',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.05em',
              marginBottom: 'var(--space-md)'
            }}>
              Skancer
            </h1>
            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--text-secondary)',
              fontWeight: '500'
            }}>
              AI 피부 진단 플랫폼
            </p>
          </div>

          {/* 버튼 섹션 */}
          <div className="flex flex-col gap-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
            
            {/* 로그인 버튼 */}
            <button
              onClick={handleLogin}
              className="btn btn-primary"
              style={{
                minHeight: '64px',
                fontSize: 'var(--text-lg)',
                fontWeight: '600',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <LogIn size={24} />
              로그인
            </button>

            {/* 회원가입 버튼 */}
            <button
              onClick={handleRegister}
              className="btn btn-secondary"
              style={{
                minHeight: '64px',
                fontSize: 'var(--text-lg)',
                fontWeight: '600'
              }}
            >
              <UserPlus size={24} />
              회원가입
            </button>

          </div>

          {/* 하단 설명 */}
          <div className="animate-fade-in" style={{ 
            animationDelay: '0.6s',
            marginTop: 'auto',
            paddingBottom: 'var(--space-2xl)'
          }}>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--text-tertiary)',
              lineHeight: '1.6',
              textAlign: 'center'
            }}>
              AI 기술로 피부 건강을 체크하고<br />
              전문의와 간편하게 상담받으세요
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthSelectPage; 