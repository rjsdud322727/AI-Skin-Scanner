'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Phone, Calendar } from 'lucide-react';
import ScannerLogo from '@/components/ScannerLogo';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleRegister = async () => {
    setIsLoading(true);
    
    // 회원가입 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 2000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
          <div className="logo text-center animate-scale-in" style={{ marginBottom: 'var(--space-xl)' }}>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <ScannerLogo size={80} />
            </div>
            <h1 className="logo-text" style={{ 
              fontSize: 'var(--text-2xl)',
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
              새 계정을 만들어 시작하세요
            </p>
          </div>

          {/* 회원가입 폼 */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            
            {/* 이름 입력 */}
            <div className="form-group mb-md">
              <div className="input-with-icon">
                <div style={{
                  position: 'absolute',
                  left: 'var(--space-md)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                  zIndex: 1
                }}>
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  placeholder="이름"
                  className="input"
                  style={{ 
                    paddingLeft: '3.5rem',
                    fontSize: 'var(--text-base)',
                    minHeight: '56px'
                  }}
                />
              </div>
            </div>

            {/* 이메일 입력 */}
            <div className="form-group mb-md">
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
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="이메일 주소"
                  className="input"
                  style={{ 
                    paddingLeft: '3.5rem',
                    fontSize: 'var(--text-base)',
                    minHeight: '56px'
                  }}
                />
              </div>
            </div>

            {/* 전화번호 입력 */}
            <div className="form-group mb-md">
              <div className="input-with-icon">
                <div style={{
                  position: 'absolute',
                  left: 'var(--space-md)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                  zIndex: 1
                }}>
                  <Phone size={20} />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  placeholder="전화번호 (010-1234-5678)"
                  className="input"
                  style={{ 
                    paddingLeft: '3.5rem',
                    fontSize: 'var(--text-base)',
                    minHeight: '56px'
                  }}
                />
              </div>
            </div>

            {/* 생년월일 입력 */}
            <div className="form-group mb-md">
              <div className="input-with-icon">
                <div style={{
                  position: 'absolute',
                  left: 'var(--space-md)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                  zIndex: 1
                }}>
                  <Calendar size={20} />
                </div>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange('birthDate')}
                  placeholder="생년월일"
                  className="input"
                  style={{
                    paddingLeft: '3.5rem',
                    fontSize: 'var(--text-base)',
                    minHeight: '56px'
                  }}
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className="form-group mb-md">
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
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  placeholder="비밀번호"
                  className="input"
                  style={{ 
                    paddingLeft: '3.5rem',
                    paddingRight: '3.5rem',
                    fontSize: 'var(--text-base)',
                    minHeight: '56px'
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

            {/* 비밀번호 확인 입력 */}
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
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  placeholder="비밀번호 확인"
                  className="input"
                  style={{ 
                    paddingLeft: '3.5rem',
                    paddingRight: '3.5rem',
                    fontSize: 'var(--text-base)',
                    minHeight: '56px'
                  }}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="input-icon"
                  style={{
                    right: 'var(--space-md)',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="btn btn-primary w-full"
              style={{
                minHeight: '56px',
                fontSize: 'var(--text-lg)',
                fontWeight: '600',
                marginBottom: 'var(--space-lg)'
              }}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner" />
                  계정 생성 중...
                </>
              ) : (
                '계정 만들기'
              )}
            </button>

            {/* 약관 동의 */}
            <div className="text-center" style={{ marginBottom: 'var(--space-lg)' }}>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-tertiary)',
                lineHeight: '1.6'
              }}>
                계정을 만들면 Skancer의{' '}
                <span style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                  이용약관
                </span>
                {' '}및{' '}
                <span style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                  개인정보처리방침
                </span>
                에 동의하게 됩니다.
              </p>
            </div>

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
              이미 계정이 있으신가요?{' '}
              <button
                onClick={() => router.push('/auth/login')}
                style={{
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  fontWeight: '600',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                로그인
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 