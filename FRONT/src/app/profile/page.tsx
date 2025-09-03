'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, User as UserIcon } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuthStore } from '@/store/auth';

const ProfilePage = () => {
  const router = useRouter();
  const { user, updateProfile, isAuthenticated } = useAuthStore();
  const fileRef = useRef<HTMLInputElement | null>(null);

  // 최초 비밀번호 확인 단계
  const [verified, setVerified] = useState(false);
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyError, setVerifyError] = useState('');

  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phoneNumber: user?.phoneNumber ?? '',
    birthDate: user?.birthDate ?? ''
  });
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPwd: '',
    confirm: ''
  });
  const [preview, setPreview] = useState<string>(user?.profileImage ?? '');
  const [saving, setSaving] = useState(false);

  // 클라이언트 hydration 이후 상태를 확인하기 위한 플래그
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트된 후 → Zustand persist 로컬스토리지 값이 복원된 뒤 렌더링
    setIsHydrated(true);
  }, []);

  // Hydration 이전에는 아무것도 렌더링하지 않음
  if (!isHydrated) {
    return null;
  }

  // 로그인되지 않은 경우에도 페이지는 유지하고 안내만 출력 (강제 리다이렉트 제거)
  if (!isAuthenticated || !user) {
    return (
      <div className="app-container flex items-center justify-center" style={{ height: '100vh' }}>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>
          로그인이 필요합니다. 설정 페이지에서 로그인 후 이용해주세요.
        </p>
      </div>
    );
  }

  const handleBack = () => router.back();

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData: any = {
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        birthDate: form.birthDate,
        profileImage: preview
      };

      // 비밀번호 변경 처리
      if (passwordForm.newPwd) {
        if (passwordForm.newPwd !== passwordForm.confirm) {
          alert('새 비밀번호가 일치하지 않습니다.');
          setSaving(false);
          return;
        }
        if (passwordForm.current !== user.password) {
          alert('현재 비밀번호가 올바르지 않습니다.');
          setSaving(false);
          return;
        }
        updateData.password = passwordForm.newPwd;
      }

      await updateProfile(updateData);
      alert('프로필이 업데이트되었습니다.');
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const renderVerify = () => (
    <div className="flex flex-col gap-lg items-center justify-center flex-1">
      <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>비밀번호 확인</h2>
      <input
        type="password"
        className="input"
        style={{ maxWidth: 280 }}
        placeholder="비밀번호 입력"
        value={verifyInput}
        onChange={e => setVerifyInput(e.target.value)}
      />
      {verifyError && <p style={{ color: '#ef4444', fontSize: 'var(--text-sm)' }}>{verifyError}</p>}
      <button className="btn btn-primary w-full" style={{ maxWidth: 280 }} onClick={() => {
        if (verifyInput === (user?.password ?? '')) {
          setVerified(true);
        } else {
          setVerifyError('비밀번호가 올바르지 않습니다.');
        }
      }}>
        확인
      </button>
    </div>
  );

  return (
    <div className="app-container">
      <div className="page-container" style={{ paddingBottom: '100px' }}>
        {/* 헤더 */}
        <div className="header">
          <button onClick={handleBack} className="header-back">
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-primary)' }}>
            프로필 관리
          </h1>
          <div style={{ width: '44px' }} />
        </div>
        {!verified ? renderVerify() : (
        <div className="page-content" style={{ gap: 'var(--space-lg)' }}>
          {/* 아바타 */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {preview ? (
                  <img src={preview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <UserIcon size={48} color="var(--text-secondary)" />
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-inverse)',
                  cursor: 'pointer'
                }}
              >
                <Camera size={20} />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileRef}
                style={{ display: 'none' }}
                onChange={handleImageSelect}
              />
            </div>
          </div>

          {/* 폼 */}
          <div className="flex flex-col gap-lg">
            <div className="form-group">
              <label htmlFor="name" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                이름
              </label>
              <input id="name" className="input" value={form.name} onChange={handleChange('name')} />
            </div>

            <div className="form-group">
              <label htmlFor="email" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                이메일
              </label>
              <input id="email" className="input" value={form.email} onChange={handleChange('email')} />
            </div>

            <div className="form-group">
              <label htmlFor="phone" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                전화번호
              </label>
              <input id="phone" className="input" value={form.phoneNumber} onChange={handleChange('phoneNumber')} />
            </div>

            <div className="form-group">
              <label htmlFor="birth" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                생년월일
              </label>
              <input
                id="birth"
                type="date"
                className="input"
                value={form.birthDate}
                onChange={handleChange('birthDate')}
              />
            </div>

            {/* 비밀번호 변경 */}
            <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
              <div className="card-header">
                <h3 className="card-title">비밀번호 변경</h3>
              </div>
              <div className="card-content flex flex-col gap-md">
                <input
                  type="password"
                  className="input"
                  placeholder="현재 비밀번호"
                  value={passwordForm.current}
                  onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                />
                <input
                  type="password"
                  className="input"
                  placeholder="새 비밀번호"
                  value={passwordForm.newPwd}
                  onChange={e => setPasswordForm({ ...passwordForm, newPwd: e.target.value })}
                />
                <input
                  type="password"
                  className="input"
                  placeholder="새 비밀번호 확인"
                  value={passwordForm.confirm}
                  onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary w-full"
            style={{ minHeight: 56, fontSize: 'var(--text-lg)' }}
          >
            {saving ? '저장 중...' : '변경 사항 저장'}
          </button>
        </div> )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage; 