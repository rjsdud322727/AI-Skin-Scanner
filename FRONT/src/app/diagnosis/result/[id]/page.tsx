'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X, Calendar, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { useDiagnosisStore } from '@/store/diagnosis';
import { formatDateTime, getRiskLevelText } from '@/utils';
import type { DiagnosisResult } from '@/types';

const DiagnosisResultPage = () => {
  const router = useRouter();
  const params = useParams();
  const { results, setCurrentDiagnosis } = useDiagnosisStore();
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    const id = params.id as string;
    const foundDiagnosis = results.find(result => result.id === id);
    
    if (foundDiagnosis) {
      setDiagnosis(foundDiagnosis);
      setCurrentDiagnosis(foundDiagnosis);
    } else {
      // Mock 진단 결과 생성
      const mockDiagnosis: DiagnosisResult = {
        id: id,
        userId: 'user_123',
        image: '/api/placeholder/400/300', // 플레이스홀더 이미지
        diseaseName: '아토피 피부염',
        riskLevel: 'medium',
        description: '피부 표면에 건조함과 가려움이 동반되는 만성 염증성 피부 질환입니다. 주로 알레르기 반응과 관련이 있으며, 피부 장벽 기능의 이상이 주요 원인입니다.',
        recommendations: [
          '피부를 건조하게 유지하지 마세요',
          '보습제를 정기적으로 사용하세요',
          '자극적인 화학 물질을 피하세요',
          '스트레스 관리를 하세요',
          '피부과 전문의와 상담하세요'
        ],
        detailedInfo: '아토피 피부염은 유전적 요인과 환경적 요인이 복합적으로 작용하여 발생하는 만성 염증성 피부 질환입니다. 주로 유아기나 어린 시절에 시작되어 성인까지 지속될 수 있으며, 피부의 건조함, 가려움, 발진 등의 증상이 특징입니다.',
        diagnosisDate: new Date().toISOString()
      };
      
      setDiagnosis(mockDiagnosis);
      setCurrentDiagnosis(mockDiagnosis);
    }
  }, [params.id, results, setCurrentDiagnosis, router]);

  const handleSave = () => {
    // 진단 결과가 이미 스토어에 저장되어 있으므로 진료기록으로 이동
    router.push('/records');
  };

  const handleClose = () => {
    // X 버튼 클릭 시 진단 결과를 저장하지 않고 카메라로 돌아감
    if (diagnosis) {
      // 현재 진단 결과를 스토어에서 제거
      const { deleteDiagnosisResult } = useDiagnosisStore.getState();
      deleteDiagnosisResult(diagnosis.id);
    }
    router.push('/diagnosis');
  };

  const handleViewDetails = () => {
    if (diagnosis) {
      router.push(`/records/${diagnosis.id}`);
    }
  };

  const getRiskIcon = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'medium':
        return <Info size={20} className="text-yellow-600" />;
      case 'high':
        return <AlertTriangle size={20} className="text-red-600" />;
    }
  };

  if (!diagnosis) {
    return null;
  }

  return (
    <div className="app-container">
      <div className="page-container" style={{ paddingBottom: '100px' }}>
        
        {/* 베젤 고려 상단 공간 */}
        <div style={{ height: 'max(20px, env(safe-area-inset-top))' }}></div>
        
        {/* 헤더 */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          borderRadius: 'var(--radius)',
          padding: 'var(--space-md)',
          width: '85%',
          margin: '0 auto var(--space-xl)', // 가운데 정렬 & 좌우 여백 확보
          color: 'var(--text-inverse)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative'
        }}>
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: 'var(--space-md)',
              right: 'var(--space-md)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-inverse)',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            <X size={20} />
          </button>
          
          <div style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
            <div style={{
              width: '48px',
              height: '48px',
              margin: '0 auto var(--space-sm)',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              {(() => {
                const icon = getRiskIcon(diagnosis.riskLevel);
                // 아이콘을 헤더에 맞게 흰색, 더 큰 크기로 표시
                return React.isValidElement(icon)
                  ? React.cloneElement(icon as React.ReactElement<any>, { size: 32, color: '#ffffff' } as any)
                  : icon;
              })()}
            </div>
            <h1 style={{ 
              fontSize: 'var(--text-xl)', 
              fontWeight: '700', 
              marginBottom: 'var(--space-xs)' 
            }}>
              진단 완료
            </h1>
            <p style={{ 
              fontSize: 'var(--text-base)', 
              opacity: 0.9 
            }}>
              AI 분석 결과입니다
            </p>
          </div>
        </div>

        {/* 진단 이미지 */}
        <div className="card animate-scale-in" style={{ marginBottom: 'var(--space-xl)' }}>
          <div style={{
            width: '100%',
            height: '200px',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            marginBottom: 'var(--space-lg)'
          }}>
            <img 
              src={diagnosis.image} 
              alt="진단 이미지" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>

        {/* 진단 정보 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          {/* 질병명과 위험도 */}
          <div className="card animate-fade-in" style={{ textAlign: 'center' }}>
            <div className="card-content">
              <h2 style={{ 
                fontSize: 'var(--text-2xl)', 
                fontWeight: '700', 
                marginBottom: 'var(--space-md)',
                color: 'var(--text-primary)'
              }}>
                {diagnosis.diseaseName}
              </h2>
              
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: 'var(--space-sm) var(--space-md)',
                borderRadius: 'var(--radius-xl)',
                background: diagnosis.riskLevel === 'medium' ? '#fef3c7' : 
                           diagnosis.riskLevel === 'high' ? '#fee2e2' : '#dcfce7',
                color: diagnosis.riskLevel === 'medium' ? '#92400e' : 
                       diagnosis.riskLevel === 'high' ? '#dc2626' : '#166534',
                fontSize: 'var(--text-sm)',
                fontWeight: '600'
              }}>
                {getRiskIcon(diagnosis.riskLevel)}
                <span>위험도: {getRiskLevelText(diagnosis.riskLevel)}</span>
              </div>
            </div>
          </div>

          {/* 진단 설명 */}
          <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-header" style={{ background: 'var(--primary-bg)' }}>
              <h3 className="card-title">진단 설명</h3>
            </div>
            <div className="card-content">
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--text-secondary)',
                lineHeight: '1.6'
              }}>
                {diagnosis.description}
              </p>
            </div>
          </div>

          {/* 질병 증상 - 모델이 제공할 경우 노출 */}
          {diagnosis.symptoms && diagnosis.symptoms.length > 0 && (
            <div className="card animate-fade-in" style={{ animationDelay: '0.25s' }}>
              <div className="card-header" style={{ background: 'var(--primary-bg)' }}>
                <h3 className="card-title">질병 증상</h3>
              </div>
              <div className="card-content">
                <ul style={{ display:'flex', flexDirection:'column', gap:'var(--space-sm)' }}>
                  {diagnosis.symptoms.map((sym, idx) => (
                    <li key={idx} style={{ fontSize:'var(--text-base)', color:'var(--text-secondary)', lineHeight:1.5 }}>
                      {sym}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 권장사항 (최대 3개) */}
          <div className="card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="card-header" style={{ background: 'var(--primary-bg)' }}>
              <h3 className="card-title">권장사항</h3>
            </div>
            <div className="card-content">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {diagnosis.recommendations.slice(0,3).map((recommendation, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--space-sm)'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      background: 'var(--primary)',
                      borderRadius: '50%',
                      marginTop: '8px',
                      flexShrink: 0
                    }}></div>
                    <p style={{
                      fontSize: 'var(--text-base)',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5'
                    }}>
                      {recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 진단 날짜 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-sm)',
            color: 'var(--text-tertiary)',
            fontSize: 'var(--text-sm)',
            marginTop: 'var(--space-lg)'
          }}>
            <Calendar size={16} />
            <span>{formatDateTime(diagnosis.diagnosisDate)}</span>
          </div>

          {/* 액션 버튼들 */}
          <div className="animate-fade-in" style={{ 
            animationDelay: '0.4s',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
            paddingTop: 'var(--space-lg)'
          }}>
            <button
              onClick={handleSave}
              className="btn btn-primary"
              style={{
                minHeight: '56px',
                fontSize: 'var(--text-lg)',
                fontWeight: '600'
              }}
            >
              진료기록에 저장
            </button>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-md)'
            }}>
              <button
                onClick={handleViewDetails}
                className="btn btn-secondary"
                style={{
                  minHeight: '48px',
                  fontSize: 'var(--text-base)'
                }}
              >
                상세보기
              </button>
              
              <button
                onClick={() => router.push('/chat')}
                className="btn btn-secondary"
                style={{
                  minHeight: '48px',
                  fontSize: 'var(--text-base)'
                }}
              >
                상담하기
              </button>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="animate-fade-in" style={{
            animationDelay: '0.5s',
            background: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: 'var(--radius)',
            padding: 'var(--space-md)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-sm)'
            }}>
              <AlertTriangle size={16} color="#d97706" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <h4 style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: '600',
                  color: '#92400e',
                  marginBottom: 'var(--space-xs)'
                }}>
                  중요한 안내
                </h4>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: '#b45309',
                  lineHeight: '1.5'
                }}>
                  이 진단 결과는 AI 분석을 통한 참고 자료입니다. 
                  정확한 진단과 치료를 위해서는 반드시 피부과 전문의의 진료를 받으시기 바랍니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 바텀 네비게이션 */}
      <BottomNavigation />
    </div>
  );
};

export default DiagnosisResultPage; 