import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiagnosisState, DiagnosisResult, MockDiagnosisResponse } from '@/types';

// Mock 진단 결과 데이터 (AI 모델 연결 전까지 사용)
const mockDiagnosisResponses: MockDiagnosisResponse[] = [
  {
    diseaseName: '아토피 피부염',
    description: '만성적이고 재발성을 보이는 염증성 피부질환으로, 가려움증과 특징적인 피부 병변을 동반합니다.',
    recommendations: [
      '보습제를 하루 2-3회 사용하세요',
      '미지근한 물로 짧게 샤워하세요',
      '자극적인 비누나 세제 사용을 피하세요',
      '면 소재의 옷을 착용하세요'
    ],
    symptoms: [
      '가려움',
      '붉은 발진',
      '건조한 피부'
    ],
    riskLevel: 'medium',
    detailedInfo: '아토피 피부염은 전 세계적으로 흔한 만성 염증성 피부질환입니다. 주로 영유아기에 시작되어 소아기, 성인기까지 지속될 수 있습니다. 유전적 소인과 환경적 요인이 복합적으로 작용하여 발생합니다.'
  },
  {
    diseaseName: '지루성 피부염',
    description: '피지 분비가 활발한 부위에 발생하는 만성 염증성 피부질환입니다.',
    recommendations: [
      '항진균 샴푸를 사용하세요',
      '스트레스를 관리하세요',
      '적절한 세안을 유지하세요',
      '기름진 음식을 피하세요'
    ],
    symptoms: [
      '가려움',
      '붉은 발진',
      '건조한 피부'
    ],
    riskLevel: 'low',
    detailedInfo: '지루성 피부염은 말라세지아 효모균과 관련이 있으며, 스트레스, 면역력 저하, 호르몬 변화 등이 악화 요인이 될 수 있습니다.'
  },
  {
    diseaseName: '건선',
    description: '면역체계 이상으로 인한 만성 자가면역성 피부질환입니다.',
    recommendations: [
      '피부과 전문의 진료를 받으세요',
      '스트레스 관리가 중요합니다',
      '금연과 금주를 권장합니다',
      '적절한 체중을 유지하세요'
    ],
    symptoms: [
      '가려움',
      '붉은 발진',
      '건조한 피부'
    ],
    riskLevel: 'high',
    detailedInfo: '건선은 T세포 매개 자가면역질환으로, 유전적 소인과 환경적 요인이 함께 작용합니다. 조기 진단과 적절한 치료가 매우 중요합니다.'
  }
];

// Mock AI 진단 함수
const mockAiDiagnosis = (imageData: string): Promise<MockDiagnosisResponse> => {
  return new Promise((resolve) => {
    // 실제 AI 처리 시뮬레이션을 위한 지연
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockDiagnosisResponses.length);
      resolve(mockDiagnosisResponses[randomIndex]);
    }, 2000); // 2초 지연
  });
};

export const useDiagnosisStore = create<DiagnosisState>()(
  persist(
    (set, get) => ({
      results: [],
      currentDiagnosis: null,
      isLoading: false,

      addDiagnosisResult: (result: Omit<DiagnosisResult, 'id'>) => {
        const newResult: DiagnosisResult = {
          ...result,
          id: Date.now().toString(),
        };
        
        set((state) => ({
          results: [newResult, ...state.results],
          currentDiagnosis: newResult,
        }));
      },

      setCurrentDiagnosis: (diagnosis: DiagnosisResult | null) => {
        set({ currentDiagnosis: diagnosis });
      },

      deleteDiagnosisResult: (id: string) => {
        set((state) => ({
          results: state.results.filter(result => result.id !== id),
          currentDiagnosis: state.currentDiagnosis?.id === id ? null : state.currentDiagnosis,
        }));
      },
    }),
    {
      name: 'diagnosis-storage',
      partialize: (state) => ({ 
        results: state.results 
      }),
    }
  )
);

// AI 진단 요청 함수 (별도 export)
export const requestDiagnosis = async (
  imageData: string, 
  userId: string
): Promise<DiagnosisResult> => {
  try {
    // Mock AI 진단 호출
    const mockResponse = await mockAiDiagnosis(imageData);
    
    const diagnosisResult: DiagnosisResult = {
      id: Date.now().toString(),
      userId,
      image: imageData,
      diseaseName: mockResponse.diseaseName,
      description: mockResponse.description,
      recommendations: mockResponse.recommendations,
      riskLevel: mockResponse.riskLevel,
      detailedInfo: mockResponse.detailedInfo,
      diagnosisDate: new Date().toISOString(),
    };

    return diagnosisResult;
  } catch (error) {
    console.error('Diagnosis error:', error);
    throw new Error('진단 중 오류가 발생했습니다.');
  }
}; 