'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  LogOut,
  ChevronRight,
  Moon
} from 'lucide-react';
import { useThemeStore } from '@/store/theme';
import BottomNavigation from '@/components/BottomNavigation';

const SettingsPage = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();

  const handleBack = () => {
    router.back();
  };

  const handleLogout = () => {
    // 로그아웃 로직
    router.push('/auth/select');
  };

  const settingsGroups = [
    {
      title: '계정',
      items: [
        {
          icon: User,
          label: '프로필 관리',
          description: '개인정보 및 프로필 설정',
          onClick: () => router.push('/profile')
        }
      ]
    },
    {
      title: '앱 설정',
      items: [
        {
          icon: Moon,
          label: '다크 모드',
          description: theme === 'dark' ? '라이트 모드로 전환' : '어두운 테마 사용',
          onClick: toggleTheme
        }
      ]
    }
  ];

  return (
    <div className="app-container">
      <div className="page-container" style={{ paddingBottom: '100px' }}>
        
        {/* 헤더 */}
        <div className="header">
          <button onClick={handleBack} className="header-back">
            <ArrowLeft size={20} />
          </button>
          <h1 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            설정
          </h1>
          <div style={{ width: '44px' }}></div>
        </div>

        <div className="page-content">
          
          {/* 사용자 정보 카드 */}
          <div className="card animate-fade-in" style={{ marginBottom: 'var(--space-xl)' }}>
            <div className="card-content">
              <div className="flex items-center gap-md">
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  <User size={36} color="var(--text-inverse)" />
                </div>
                <div className="flex-1">
                  <h2 style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: '700',
                    marginBottom: 'var(--space-xs)',
                    color: 'var(--text-primary)'
                  }}>
                    홍길동
                  </h2>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-sm)'
                  }}>
                    test@example.com
                  </p>
                  <span className="badge badge-success">
                    프리미엄 회원
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 설정 그룹 */}
          {settingsGroups.map((group, groupIndex) => (
            <div 
              key={group.title}
              className="animate-fade-in" 
              style={{ 
                animationDelay: `${0.2 + groupIndex * 0.1}s`,
                marginBottom: 'var(--space-xl)'
              }}
            >
              <h3 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: '600',
                marginBottom: 'var(--space-md)',
                color: 'var(--text-primary)'
              }}>
                {group.title}
              </h3>

              <div className="card">
                <div className="card-content" style={{ padding: 0 }}>
                  {group.items.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={item.onClick}
                        style={{
                          width: '100%',
                          padding: 'var(--space-lg)',
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          transition: 'var(--transition)',
                          borderBottom: index < group.items.length - 1 ? '1px solid var(--border)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--bg-secondary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-md">
                            <div style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: 'var(--radius)',
                              background: 'var(--bg-tertiary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <IconComponent size={20} color="var(--text-secondary)" />
                            </div>
                            <div className="text-left">
                              <h4 style={{
                                fontSize: 'var(--text-base)',
                                fontWeight: '600',
                                marginBottom: '2px',
                                color: 'var(--text-primary)'
                              }}>
                                {item.label}
                              </h4>
                              <p style={{
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-secondary)'
                              }}>
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <ChevronRight size={20} color="var(--text-tertiary)" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* 로그아웃 버튼 */}
          <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                minHeight: '56px',
                padding: 'var(--space-lg)',
                border: '2px solid #ef4444',
                borderRadius: 'var(--radius)',
                background: 'transparent',
                color: '#ef4444',
                fontSize: 'var(--text-lg)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'var(--transition)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-sm)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ef4444';
                e.currentTarget.style.color = 'var(--text-inverse)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#ef4444';
              }}
            >
              <LogOut size={20} />
              로그아웃
            </button>
          </div>

          {/* 앱 정보 */}
          <div className="text-center mt-xl animate-fade-in" style={{ animationDelay: '1s' }}>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-tertiary)',
              marginBottom: 'var(--space-sm)'
            }}>
              Skancer v1.0.0
            </p>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-tertiary)'
            }}>
              © 2024 Skancer. All rights reserved.
            </p>
          </div>

        </div>
      </div>

      {/* 바텀 네비게이션 */}
      <BottomNavigation />
    </div>
  );
};

export default SettingsPage; 