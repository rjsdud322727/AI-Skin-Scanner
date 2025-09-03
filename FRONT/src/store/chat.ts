import { create } from 'zustand';
import type { ChatState, ChatMessage } from '@/types';

// Mock 챗봇 응답 데이터
const mockChatResponses = [
  {
    keywords: ['예약', '병원', '진료'],
    responses: [
      '어떤 병원에서 진료받고 싶으신가요? 지역을 알려주시면 근처 피부과를 추천해드릴게요.',
      '원하시는 진료 날짜와 시간대를 알려주세요.',
      '예약하고 싶은 진료 목적을 말씀해주시면 적합한 전문의를 추천해드릴게요.'
    ]
  },
  {
    keywords: ['피부', '질환', '증상'],
    responses: [
      '어떤 피부 증상이 있으신지 자세히 말씀해주세요.',
      '증상이 언제부터 시작되었는지, 어느 부위에 나타나는지 알려주세요.',
      '가려움, 발진, 붓기 등 구체적인 증상을 설명해주시면 더 정확한 도움을 드릴 수 있어요.'
    ]
  },
  {
    keywords: ['진단', '결과', '의견'],
    responses: [
      '진단 결과에 대해 궁금한 점이 있으시면 언제든지 말씀해주세요.',
      '추가적인 관리 방법이나 주의사항에 대해 안내해드릴게요.',
      '진단 결과를 바탕으로 전문의 진료 예약을 도와드릴 수 있어요.'
    ]
  }
];

// Mock 챗봇 응답 생성 함수
const generateMockResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  
  for (const category of mockChatResponses) {
    if (category.keywords.some(keyword => message.includes(keyword))) {
      const randomIndex = Math.floor(Math.random() * category.responses.length);
      return category.responses[randomIndex];
    }
  }
  
  // 기본 응답
  const defaultResponses = [
    '안녕하세요! 피부 건강 관리와 병원 예약에 대해 도움을 드릴 수 있어요.',
    '궁금한 점이 있으시면 언제든지 말씀해주세요.',
    '피부 진단, 병원 예약, 관리 방법에 대해 문의해주시면 상세히 안내해드릴게요.',
    '어떤 도움이 필요하신지 구체적으로 말씀해주시면 더 정확한 답변을 드릴 수 있어요.'
  ];
  
  const randomIndex = Math.floor(Math.random() * defaultResponses.length);
  return defaultResponses[randomIndex];
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
    {
      id: '1',
      message: '안녕하세요! 피부 건강 관리와 병원 예약을 도와드리는 Skancer 챗봇입니다. 무엇을 도와드릴까요?',
      isUser: false,
      timestamp: new Date().toISOString(),
    }
  ],
  isLoading: false,

  addMessage: (messageData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  clearMessages: () => {
    set({
      messages: [
        {
          id: '1',
          message: '안녕하세요! 피부 건강 관리와 병원 예약을 도와드리는 Skancer 챗봇입니다. 무엇을 도와드릴까요?',
          isUser: false,
          timestamp: new Date().toISOString(),
        }
      ]
    });
  },

  sendMessage: async (message: string) => {
    const { addMessage } = get();
    
    // 사용자 메시지 추가
    addMessage({ message, isUser: true });
    
    // 로딩 상태 설정
    set({ isLoading: true });
    
    try {
      // Mock 챗봇 응답 시뮬레이션 (실제 API 호출로 대체 예정)
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 지연
      
      const botResponse = generateMockResponse(message);
      
      // 봇 응답 추가
      addMessage({ message: botResponse, isUser: false });
      
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({ 
        message: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.', 
        isUser: false 
      });
    } finally {
      set({ isLoading: false });
    }
  },
})); 