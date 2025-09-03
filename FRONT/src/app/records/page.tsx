'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Calendar, Filter } from 'lucide-react';
import Button from '@/components/Button';
import BottomNavigation from '@/components/BottomNavigation';
import { useDiagnosisStore } from '@/store/diagnosis';
import { formatRelativeDate, getRiskLevelColor, getRiskLevelText } from '@/utils';
import type { DiagnosisResult } from '@/types';

const RecordsPage = () => {
  const router = useRouter();
  const results = useDiagnosisStore(state => state.results);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [filteredResults, setFilteredResults] = useState<DiagnosisResult[]>([]);

  useEffect(() => {
    let filtered = results;

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(result => 
        result.diseaseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 위험도 필터
    if (filterRisk !== 'all') {
      filtered = filtered.filter(result => result.riskLevel === filterRisk);
    }

    // 날짜순 정렬 (최신순)
    filtered = filtered.sort((a, b) => 
      new Date(b.diagnosisDate).getTime() - new Date(a.diagnosisDate).getTime()
    );

    setFilteredResults(filtered);
  }, [results, searchTerm, filterRisk]);

  // 바텀 네비게이션 클릭은 BottomNavigation 내부 router.push 처리

  const handleRecordClick = (recordId: string) => {
    router.push(`/records/${recordId}`);
  };

  const handleBack = () => {
    router.back();
  };

  const getRiskBadge = (level: 'low' | 'medium' | 'high') => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(level)}`}>
        {getRiskLevelText(level)}
      </span>
    );
  };

  return (
    <div className="app-container">
      <div className="page-container" style={{ paddingBottom: '100px' }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-lg)'
      }}>
        <button
          onClick={handleBack}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', color: 'var(--text-primary)' }}>진료기록</h1>
        <div style={{ width: '44px' }} />
      </div>

      {/* 검색 및 필터 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
        {/* 검색 */}
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', top: '50%', left: 'var(--space-md)', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="질병명 또는 설명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
            style={{ paddingLeft: '44px' }}
          />
        </div>

        {/* 위험도 필터 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <Filter size={16} style={{ color: 'var(--text-tertiary)' }} />
          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
            {(['all', 'low', 'medium', 'high'] as const).map((risk) => (
              <button
                key={risk}
                onClick={() => setFilterRisk(risk)}
                className="badge"
                style={{
                  background: filterRisk === risk ? 'var(--primary)' : 'var(--bg-secondary)',
                  color: filterRisk === risk ? 'var(--text-inverse)' : 'var(--text-secondary)'
                }}
              >
                {risk === 'all' ? '전체' : getRiskLevelText(risk)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 기록 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', flex: 1, overflowY: 'auto' }}>
        {filteredResults.length > 0 ? (
          filteredResults.map((record) => (
            <button
              key={record.id}
              onClick={() => handleRecordClick(record.id)}
              className="card card-interactive"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                padding: 'var(--space-md)',
                textAlign: 'left'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <img src={record.image} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--space-xs)', color: 'var(--text-primary)' }}>{record.diseaseName}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                  <Calendar size={14} />
                  <span>{formatRelativeDate(record.diagnosisDate)}</span>
                </div>
              </div>
              <span className="badge" style={{
                background: record.riskLevel === 'medium' ? '#fef3c7' : record.riskLevel === 'high' ? '#fee2e2' : '#dcfce7',
                color: record.riskLevel === 'medium' ? '#92400e' : record.riskLevel === 'high' ? '#dc2626' : '#166534'
              }}>
                {getRiskLevelText(record.riskLevel)}
              </span>
            </button>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)' }}>진료기록이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 바텀 네비 */}
      <BottomNavigation />

      </div>
    </div>
  );
};

export default RecordsPage; 