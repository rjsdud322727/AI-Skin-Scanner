'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ScannerLogo from '@/components/ScannerLogo';

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            router.push('/auth/select');
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="app-container">
      <div className="page-container">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 'var(--space-2xl)'
        }}>
          
          {/* 로고 섹션 */}
          <div className="logo animate-float text-center">
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <ScannerLogo size={140} />
            </div>
            <h1 className="logo-text" style={{ 
              fontSize: 'var(--text-4xl)',
              fontWeight: '300',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.05em'
            }}>
              Skancer
            </h1>
          </div>

          {/* 프로그레스 바 */}
          <div className="animate-fade-in" style={{ 
            animationDelay: '0.5s',
            width: '100%',
            maxWidth: '280px'
          }}>
            <div style={{
              width: '100%',
              height: '6px',
              background: 'var(--bg-tertiary)',
              borderRadius: '3px',
              overflow: 'hidden',
              marginBottom: 'var(--space-lg)'
            }}>
              <div 
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%)',
                  transition: 'width 0.3s ease-out',
                  borderRadius: '3px'
                }}
              />
            </div>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--text-secondary)',
              fontWeight: '500',
              textAlign: 'center'
            }}>
              {progress}% 로딩 중...
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoadingPage; 