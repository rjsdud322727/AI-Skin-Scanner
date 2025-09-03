'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Mic, Paperclip, Bot, User, Calendar, MapPin, Clock } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

type MessageType = 'text' | 'options' | 'appointment';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: MessageType;
  options?: string[];
  appointmentData?: {
    hospital: string;
    date: string;
    time: string;
    doctor: string;
  };
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '안녕하세요! AI 도우미입니다. 무엇을 도와드릴까요?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'options',
      options: ['피부 상담', '진료 예약']
    }
  ]);

  const [mode, setMode] = useState<'consult' | 'appointment' | null>(null);
  const [conversationStep, setConversationStep] = useState(0);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const consultResponses = [
    '피부 상태에 대해 더 자세히 알려주시면 더 정확한 조언을 드릴 수 있습니다.',
    '사진을 업로드하시면 AI 진단을 통해 더 정확한 분석이 가능합니다.',
    '피부과 전문의와 상담을 원하시면 진료 예약을 도와드릴게요.',
    '일반적으로 피부 건강을 위해서는 충분한 수분 공급과 자외선 차단이 중요합니다.'
  ];

  const appointmentResponses: Array<{
    content: string;
    type: MessageType;
    options?: string[];
    appointmentData?: {
      hospital: string;
      date: string;
      time: string;
      doctor: string;
    };
  }> = [
    {
      content: '어떤 증상으로 진료를 받고 싶으신가요?',
      type: 'options',
      options: ['피부 트러블', '아토피', '여드름', '점/사마귀', '기타']
    },
    {
      content: '희망하시는 지역을 선택해주세요.',
      type: 'options',
      options: ['강남구', '중구', '마포구', '송파구', '기타 지역']
    },
    {
      content: '지역의 피부과를 찾았습니다. 병원을 선택해주세요.',
      type: 'options',
      options: ['서울피부과의원 (4.8⭐)', '명동피부클리닉 (4.9⭐)', '홍대피부과 (4.7⭐)']
    },
    {
      content: '예약 가능한 날짜를 선택해주세요.',
      type: 'options',
      options: ['오늘 (1월 16일)', '내일 (1월 17일)', '모레 (1월 18일)', '다른 날짜']
    },
    {
      content: '예약 가능한 시간을 선택해주세요.',
      type: 'options',
      options: ['오전 9:00', '오전 10:30', '오후 2:00', '오후 3:30', '오후 5:00']
    },
    {
      content: '예약이 완료되었습니다! 예약 정보를 확인해주세요.',
      type: 'appointment',
      appointmentData: {
        hospital: '서울피부과의원',
        date: '1월 17일 (수)',
        time: '오후 2:00',
        doctor: '김피부과 전문의'
      }
    }
  ];

  const handleSendMessage = (overrideMsg?: string) => {
    const userText = overrideMsg ?? inputMessage;
    if (!userText.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    if (!overrideMsg) setInputMessage('');

    setIsTyping(true);

    setTimeout(() => {
      let botMessage: Message | null = null;

      if (!mode) {
        // 첫 선택 단계
        if (userText.includes('상담')) {
          setMode('consult');
          botMessage = {
            id: (Date.now() + 1).toString(),
            content: '어떤 피부 고민이 있으신가요? 자세히 말씀해주세요!',
            sender: 'bot',
            timestamp: new Date()
          };
        } else {
          setMode('appointment');
          setConversationStep(0);
          const first = appointmentResponses[0];
          botMessage = {
            id: (Date.now() + 1).toString(),
            content: first.content,
            sender: 'bot',
            timestamp: new Date(),
            type: first.type,
            options: first.options
          };
        }
      } else if (mode === 'consult') {
        botMessage = {
          id: (Date.now() + 1).toString(),
          content: consultResponses[Math.floor(Math.random()*consultResponses.length)],
          sender: 'bot',
          timestamp: new Date()
        };
      } else {
        // appointment 모드
        const nextStep = conversationStep + 1;
        setConversationStep(nextStep);
        const resp = appointmentResponses[nextStep] ?? {
          content: '추가로 도움이 필요하시면 언제든 말씀해주세요!',
          type: 'text'
        };
        botMessage = {
          id: (Date.now() + 1).toString(),
          content: resp.content,
          sender: 'bot',
          timestamp: new Date(),
          type: resp.type,
          options: resp.options,
          appointmentData: resp.appointmentData
        };
      }

      if (botMessage) {
        setMessages(prev => [...prev, botMessage]);
      }
      setIsTyping(false);
    }, 1200);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="app-container">
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh',
        paddingBottom: '100px'
      }}>
        
        {/* 헤더 */}
        <div className="header" style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-primary)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <button onClick={handleBack} className="header-back">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-sm">
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius)',
              background: 'var(--primary-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={20} color="var(--primary)" />
            </div>
            <div>
              <h1 style={{
                fontSize: 'var(--text-lg)',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                AI 상담사
              </h1>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)'
              }}>
                온라인
              </p>
            </div>
          </div>
          <div style={{ width: '44px' }}></div>
        </div>

        {/* 메시지 영역 */}
        <div style={{
          flex: 1,
          padding: 'var(--space-md)',
          overflow: 'auto',
          background: 'var(--bg-secondary)'
        }} className="scroll-container">
          <div className="flex flex-col gap-md">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`flex items-end gap-xs max-w-[85%] ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* 아바타 */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background:
                        message.sender === 'user' ? 'var(--primary)' : 'var(--bg-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {message.sender === 'user' ? (
                      <User size={16} color="var(--text-inverse)" />
                    ) : (
                      <Bot size={16} color="var(--primary)" />
                    )}
                  </div>

                  {/* 메시지 버블 */}
                  <div>
                    <div
                      style={{
                        background:
                          message.sender === 'user'
                            ? 'var(--primary)'
                            : 'var(--bg-primary)',
                        color:
                          message.sender === 'user'
                            ? 'var(--text-inverse)'
                            : 'var(--text-primary)',
                        padding: 'var(--space-sm) var(--space-md)',
                        borderRadius: 'var(--radius)',
                        fontSize: 'var(--text-base)',
                        lineHeight: '1.5',
                        boxShadow: 'var(--shadow-sm)',
                        marginBottom: '4px'
                      }}
                    >
                      {message.content}
                    </div>

                    {/* 옵션 버튼들 */}
                    {message.type === 'options' && message.options && (
                      <div style={{ marginTop: 'var(--space-sm)' }}>
                        <div className="flex flex-col gap-xs">
                          {message.options.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(option)}
                              style={{
                                padding: 'var(--space-sm) var(--space-md)',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--space-sm)',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--primary)',
                                cursor: 'pointer',
                                transition: 'var(--transition)',
                                textAlign: 'left'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--primary-bg)';
                                e.currentTarget.style.borderColor = 'var(--primary)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--bg-primary)';
                                e.currentTarget.style.borderColor = 'var(--border)';
                              }}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 예약 정보 카드 */}
                    {message.type === 'appointment' && message.appointmentData && (
                      <div style={{ marginTop: 'var(--space-sm)' }}>
                        <div className="card">
                          <div className="card-content" style={{ padding: 'var(--space-md)' }}>
                            <h4
                              style={{
                                fontSize: 'var(--text-lg)',
                                fontWeight: '600',
                                marginBottom: 'var(--space-md)',
                                color: 'var(--text-primary)'
                              }}
                            >
                              📅 예약 확정
                            </h4>

                            <div className="flex items-center gap-sm mb-sm">
                              <MapPin size={16} color="var(--text-secondary)" />
                              <span style={{ fontSize: 'var(--text-base)' }}>
                                {message.appointmentData.hospital}
                              </span>
                            </div>

                            <div className="flex items-center gap-sm mb-sm">
                              <Calendar size={16} color="var(--text-secondary)" />
                              <span style={{ fontSize: 'var(--text-base)' }}>
                                {message.appointmentData.date}
                              </span>
                            </div>

                            <div className="flex items-center gap-sm mb-md">
                              <Clock size={16} color="var(--text-secondary)" />
                              <span style={{ fontSize: 'var(--text-base)' }}>
                                {message.appointmentData.time}
                              </span>
                            </div>

                            <div
                              style={{
                                background: 'var(--primary-bg)',
                                padding: 'var(--space-sm)',
                                borderRadius: 'var(--space-sm)',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--primary)'
                              }}
                            >
                              담당의: {message.appointmentData.doctor}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 시간 */}
                    <div
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-tertiary)',
                        textAlign: message.sender === 'user' ? 'right' : 'left'
                      }}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 타이핑 인디케이터 */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-end gap-xs">
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Bot size={16} color="var(--primary)" />
                  </div>
                  <div style={{
                    background: 'var(--bg-primary)',
                    padding: 'var(--space-sm) var(--space-md)',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div className="flex gap-xs">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 입력 영역 */}
        <div style={{
          padding: 'var(--space-md)',
          background: 'var(--bg-primary)',
          borderTop: '1px solid var(--border)'
        }}>
          <div className="flex items-end gap-sm">
            
            {/* 첨부 버튼 */}
            <button style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius)',
              background: 'var(--bg-secondary)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}>
              <Paperclip size={20} />
            </button>

            {/* 입력 필드 */}
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                style={{
                  width: '100%',
                  minHeight: '44px',
                  maxHeight: '120px',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '2px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-base)',
                  fontFamily: 'inherit',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  resize: 'none',
                  outline: 'none',
                  transition: 'var(--transition)'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* 음성/전송 버튼 */}
            {inputMessage.trim() ? (
              <button
                onClick={() => handleSendMessage()}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius)',
                  background: 'var(--primary)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-inverse)',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <Send size={20} />
              </button>
            ) : (
              <button style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius)',
                background: 'var(--bg-secondary)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}>
                <Mic size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 바텀 네비게이션 */}
      <BottomNavigation />

      {/* 타이핑 애니메이션 스타일 */}
      <style jsx>{`
        .typing-dot {
          width: 6px;
          height: 6px;
          background: var(--text-tertiary);
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) {
          animation-delay: -0.32s;
        }

        .typing-dot:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatPage; 