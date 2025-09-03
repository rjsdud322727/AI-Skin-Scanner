'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Image, RotateCcw } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { useDiagnosisStore, requestDiagnosis } from '@/store/diagnosis';

const DiagnosisPage = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [permissionPrompt, setPermissionPrompt] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();

  // 초기에는 사용자 상호작용을 통해 카메라를 시작해야 모바일 브라우저에서 권한 요청이 제대로 뜸
  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(window.navigator.userAgent);
    if (isMobile) {
      setPermissionPrompt(true);
    } else {
    startCamera();
    }
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // 후면 카메라 우선
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await (videoRef.current as HTMLVideoElement).play();
        } catch (e) {
          console.warn('Video play error', e);
        }
        setIsCameraReady(true);
      } else {
        // video 요소가 아직 마운트되지 않은 경우, DOM 업데이트 후 다시 설정
        const id = requestAnimationFrame(() => {
          if (videoRef.current) {
            (videoRef.current as HTMLVideoElement).srcObject = streamRef.current;
            (videoRef.current as HTMLVideoElement).play();
            setIsCameraReady(true);
          }
        });
      }
    } catch (err) {
      console.error('Camera error:', err);
      // 카메라 접근 실패 시 기본 화면 표시
      setIsCameraReady(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleBack = () => {
    stopCamera();
    router.back();
  };

  const handleStartCamera = () => {
    // 먼저 UI를 업데이트하여 video 요소가 DOM에 렌더링되도록 함
    setPermissionPrompt(false);

    // 다음 프레임에서 카메라 시작 (videoRef 가 준비된 이후)
    requestAnimationFrame(() => {
      startCamera();
    });
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
      stopCamera();
    }
  };

  const selectFromGallery = () => {
    // 실제 구현에서는 파일 입력을 통해 이미지 선택
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    // 모바일 브라우저에서 바로 카메라 촬영하도록 힌트
    (input as any).capture = 'environment';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCapturedImage(e.target?.result as string);
          stopCamera();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);

    try {
      // Mock AI 요청 (2초 지연 포함)
      const aiResult = await requestDiagnosis(capturedImage, 'user_123');

      // addDiagnosisResult 는 id 를 다시 생성하므로 기존 id 제거
      const { id: _ignoredId, ...resultWithoutId } = aiResult as any;

      const { addDiagnosisResult } = useDiagnosisStore.getState();
      addDiagnosisResult(resultWithoutId);

      // addDiagnosisResult 실행 직후 첫 번째 요소가 가장 최신
      const newId = useDiagnosisStore.getState().results[0]?.id;

      if (newId) {
        router.push(`/diagnosis/result/${newId}`);
      }
    } catch (err) {
      console.error(err);
      alert('AI 분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="app-container">
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh',
        background: '#000000',
        paddingBottom: '100px'
      }}>
        
        {/* 상단 컨트롤 */}
        <div style={{
          position: 'absolute',
          top: 'max(20px, env(safe-area-inset-top))',
          left: 0,
          right: 0,
          zIndex: 20,
          padding: 'var(--space-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handleBack}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            <ArrowLeft size={24} />
          </button>

          {capturedImage && (
            <button
              onClick={retakePhoto}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.5)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              <RotateCcw size={20} />
            </button>
          )}
        </div>

        {/* 카메라/이미지 영역 */}
        <div style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {permissionPrompt ? (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#ffffff',
              zIndex: 30
            }}>
              <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-md)' }}>
                카메라 사용을 위해 권한을 허용해주세요
              </p>
              <button
                onClick={handleStartCamera}
                style={{
                  padding: 'var(--space-sm) var(--space-lg)',
                  background: 'var(--primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-xl)',
                  color: '#ffffff',
                  fontSize: 'var(--text-base)',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                카메라 시작
              </button>
            </div>
          ) : capturedImage ? (
            // 캡처된 이미지 표시
            <img
              src={capturedImage}
              alt="촬영된 이미지"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            // 카메라 피드
            <>
              <video
                ref={videoRef}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                playsInline
                muted
              />
              
              {/* 촬영 가이드 */}
              {isCameraReady && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '280px',
                  height: '280px',
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  borderRadius: 'var(--radius-xl)',
                  pointerEvents: 'none'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#ffffff',
                    fontSize: 'var(--text-sm)',
                    textAlign: 'center',
                    background: 'rgba(0, 0, 0, 0.5)',
                    padding: 'var(--space-xs) var(--space-sm)',
                    borderRadius: 'var(--space-sm)'
                  }}>
                    피부 부위를 가이드 안에 맞춰주세요
                  </div>
                </div>
              )}

              {!isCameraReady && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: '#ffffff'
                }}>
                  <Camera size={48} style={{ marginBottom: 'var(--space-md)' }} />
                  <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-sm)' }}>
                    카메라 준비 중...
                  </p>
                  <p style={{ fontSize: 'var(--text-sm)', opacity: 0.8 }}>
                    카메라 권한을 허용해주세요
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* 하단 컨트롤 */}
        <div style={{
          position: 'absolute',
          bottom: 'max(120px, calc(100px + env(safe-area-inset-bottom)))',
          left: 0,
          right: 0,
          padding: 'var(--space-xl)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'var(--space-xl)',
          zIndex: 10
        }}>

          {capturedImage ? (
            // 이미지 캡처 후 버튼들
            <button
              onClick={analyzeImage}
              disabled={isAnalyzing}
              style={{
                padding: 'var(--space-md) var(--space-xl)',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                border: 'none',
                borderRadius: 'var(--radius-xl)',
                color: 'var(--text-inverse)',
                fontSize: 'var(--text-lg)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'var(--transition)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)'
              }}
            >
              {isAnalyzing ? (
                <>
                  <div className="loading-spinner" />
                  AI 분석 중...
                </>
              ) : (
                'AI 진단 시작'
              )}
            </button>
          ) : (
            // 카메라 화면 버튼들
            <>
              {/* 갤러리 버튼 */}
              <button
                onClick={selectFromGallery}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <Image size={24} color="#000000" />
              </button>

              {/* 셔터 버튼 */}
              <button
                onClick={capturePhoto}
                disabled={!isCameraReady}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isCameraReady ? 'pointer' : 'not-allowed',
                  transition: 'var(--transition)',
                  opacity: isCameraReady ? 1 : 0.5
                }}
              >
                <Camera size={32} color="#000000" />
              </button>

              {/* 오른쪽 여백 (대칭을 위해) */}
              <div style={{ width: '50px' }}></div>
            </>
          )}
        </div>

        {/* 숨겨진 캔버스 */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {/* 바텀 네비게이션 */}
      <BottomNavigation />
    </div>
  );
};

export default DiagnosisPage; 