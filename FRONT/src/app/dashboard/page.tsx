'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Camera, 
  User, 
  Settings
} from 'lucide-react';
import ScannerLogo from '@/components/ScannerLogo';
import BottomNavigation from '@/components/BottomNavigation';
import { useDiagnosisStore } from '@/store/diagnosis';
import { formatDateTime, getRiskLevelText } from '@/utils';

const DashboardPage = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDiagnosis = () => {
    router.push('/diagnosis');
  };

  // AI 상담/진료예약 빠른 액세스 버튼 삭제됨 -> 핸들러 제거

  const handleRecords = () => {
    router.push('/records');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const results = useDiagnosisStore(state => state.results);
  const latestResults = [...results]
    .sort((a, b) => new Date(b.diagnosisDate).getTime() - new Date(a.diagnosisDate).getTime())
    .slice(0, 3);

  return (
    <div className="app-container">
      <div className="page-container" style={{ paddingBottom: '100px' }}>
        
        {/* 베젤 고려 상단 공간 */}
        <div style={{ height: 'max(20px, env(safe-area-inset-top))' }}></div>
        
        {/* 헤더 */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          borderRadius: 'var(--radius)',
          padding: 'var(--space-lg)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-xl)',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
        }}>
          {/* 로고와 설정 버튼 */}
          <div className="flex items-center justify-between mb-lg">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: 'var(--radius)',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <ScannerLogo size={40} />
              </div>
              <span style={{ fontSize: 'var(--text-xl)', fontWeight: 300, color: 'var(--text-inverse)' }}>
                Skancer!
              </span>
            </div>
            <button
              onClick={handleSettings}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: 'var(--radius)',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              <Settings size={24} />
            </button>
          </div>

          {/* 사용자 정보 */}
          <div className="flex items-center gap-md">
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: 'var(--radius)',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}>
              <User size={28} color="var(--primary)" />
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', marginBottom: '4px', color: 'var(--text-inverse)' }}>
                안녕하세요, 홍길동님!
              </h1>
              <p style={{ fontSize: 'var(--text-base)', opacity: 0.9, color: 'var(--text-inverse)' }}>
                {currentTime.toLocaleDateString('ko-KR', { 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'short'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* AI 진단 메인 버튼 - 크게 확대 */}
        <div className="card card-interactive mb-xl animate-scale-in">
          <button
            onClick={handleDiagnosis}
            className="card-content w-full text-left"
            style={{ padding: 'var(--space-2xl)', border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 style={{ 
                  fontSize: 'var(--text-2xl)', 
                  fontWeight: '700', 
                  marginBottom: 'var(--space-sm)',
                  color: 'var(--text-primary)'
                }}>
                  AI 피부 진단
                </h2>
                <p style={{ 
                  fontSize: 'var(--text-lg)', 
                  color: 'var(--text-secondary)',
                  wordBreak: 'keep-all'
                }}>
                  사진으로 간편하게 진단받기
                </p>
              </div>
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <Camera size={36} color="var(--text-inverse)" />
              </div>
            </div>
          </button>
        </div>

        {/* 빠른 액세스 섹션 삭제됨 */}

        {/* 최근 진단 */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {latestResults.length === 0 ? (
            <div className="card">
              <div className="card-content text-center">
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>
                  최근 진단 기록이 없습니다.
                </p>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-header" style={{ background: 'var(--primary-bg)' }}>
                <h3 className="card-title" style={{ fontSize: 'var(--text-xl)' }}>최근 진단</h3>
              </div>
              <div className="card-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {latestResults.map(result => (
                  <div key={result.id} className="flex items-center gap-md">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: 'var(--radius)',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      <img src={result.image} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 'var(--text-base)', fontWeight: '600', marginBottom: '2px' }}>
                        {result.diseaseName}
                      </h4>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                        {formatDateTime(result.diagnosisDate)}
                      </p>
                    </div>
                    <span className="badge" style={{
                      background: result.riskLevel === 'medium' ? '#fef3c7' : result.riskLevel === 'high' ? '#fee2e2' : '#dcfce7',
                      color: result.riskLevel === 'medium' ? '#92400e' : result.riskLevel === 'high' ? '#dc2626' : '#166534'
                    }}>
                      {getRiskLevelText(result.riskLevel)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 바텀 네비게이션 */}
      <BottomNavigation />
    </div>
  );
};

export default DashboardPage; 