'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, Plus } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleNewAppointment = () => {
    router.push('/chat'); // 통합 AI 도우미 페이지로 이동
  };

  // === Mock 예약 데이터 (현재 날짜 기준) ===
  const todayDate = new Date();

  const toISODate = (d: Date) => {
    return d.toISOString().split('T')[0];
  };

  const addDays = (base: Date, days: number) => {
    const copy = new Date(base);
    copy.setDate(base.getDate() + days);
    return copy;
  };

  const appointments = [
    {
      id: 1,
      date: toISODate(addDays(todayDate, 3)), // 오늘 +3일
      time: '14:00',
      doctor: '김피부과 전문의',
      location: '강남점',
      type: '진료 상담',
      status: 'confirmed',
      diseaseName: '여드름'
    },
    {
      id: 2,
      date: toISODate(addDays(todayDate, 10)), // 오늘 +10일
      time: '10:30',
      doctor: '이피부과 전문의',
      location: '홍대점',
      type: '경과 관찰',
      status: 'pending',
      diseaseName: '건선'
    }
  ];

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // 달력 생성 로직
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // 빈 칸 추가
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    // 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      // 같은 연-월-일 모두 일치해야 예약 표시
      const hasAppointment = appointments.some(app => {
        const d = new Date(app.date);
        return (
          d.getFullYear() === currentYear &&
          d.getMonth() === currentMonth &&
          d.getDate() === day
      );
      });

      const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;

      // today 스타일 인라인으로 적용 (셀 레이아웃 유지)
      let spanStyle: React.CSSProperties | undefined;

      const dow = new Date(currentYear, currentMonth, day).getDay();

      if (isToday) {
        spanStyle = {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: '#ef4444',
          color: '#ffffff',
          fontWeight: 700,
        };
      } else if (hasAppointment) {
        spanStyle = {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'var(--primary)',
          color: '#ffffff',
          fontWeight: 700,
        };
      } else {
        if (dow === 0) {
          spanStyle = { color: '#ef4444' }; // Sunday red
        } else if (dow === 6) {
          spanStyle = { color: '#3b82f6' }; // Saturday blue
        }
      }

      days.push(
        <div
          key={day}
          className={`calendar-day ${hasAppointment ? 'has-appointment' : ''}`}
          onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
        >
          <span style={spanStyle}>{day}</span>
          {/* 예약 점은 원형으로 대체되므로 제거 */}
        </div>
      );
    }

    return days;
  };

  const getAppointmentsForSelectedDate = () => {
    if (!selectedDate) return [];
    return appointments.filter(app => new Date(app.date).toDateString() === selectedDate.toDateString());
  };

  // 예약 데이터가 있으면 가장 가까운 예약일을 기본 선택, 없으면 오늘
  useEffect(() => {
    if (appointments.length > 0) {
      const nearest = [...appointments]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
      setSelectedDate(new Date(nearest.date));
    } else {
      setSelectedDate(new Date());
    }
  }, []);

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
            진료 캘린더
          </h1>
          <div style={{ width: '44px' }} />
        </div>

        <div className="page-content">
          
          {/* 월 표시 */}
          <div className="text-center mb-xl animate-fade-in">
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-sm)'
            }}>
              {currentYear}년 {currentMonth + 1}월
            </h2>
            <p style={{
              fontSize: 'var(--text-base)',
              color: 'var(--text-secondary)'
            }}>
              예약 일정을 확인하세요
            </p>
          </div>

          {/* 달력 */}
          <div className="card mb-xl animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-content">
              {/* 요일 헤더 */}
              <div className="calendar-header">
                {['일', '월', '화', '수', '목', '금', '토'].map((dayLabel, idx) => (
                  <div
                    key={dayLabel}
                    className="calendar-day-header"
                    style={idx === 0 ? { color: '#ef4444' } : idx === 6 ? { color: '#3b82f6' } : undefined}
                  >
                    {dayLabel}
                  </div>
                ))}
              </div>
              
              {/* 날짜 그리드 */}
              <div className="calendar-grid">
                {renderCalendar()}
              </div>
            </div>
          </div>

          {/* 선택된 날짜의 예약 */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              marginBottom: 'var(--space-md)',
              color: 'var(--text-primary)'
            }}>
              {selectedDate ? selectedDate.toLocaleDateString('ko-KR') : ''} 예약
            </h3>

            {getAppointmentsForSelectedDate().length > 0 ? (
              <div className="flex flex-col gap-md">
                {getAppointmentsForSelectedDate().map(appointment => (
                  <div key={appointment.id} className="card">
                    <div className="card-content">
                      <div className="flex items-center justify-between mb-md">
                        <div className="flex items-center gap-sm">
                          <CalendarIcon size={20} color="var(--primary)" />
                          <span style={{
                            fontSize: 'var(--text-lg)',
                            fontWeight: '600',
                            color: 'var(--text-primary)'
                          }}>
                            {appointment.type}
                          </span>
                        </div>
                        <span className={`badge ${
                          appointment.status === 'confirmed' ? 'badge-success' : 'badge-warning'
                        }`}>
                          {appointment.status === 'confirmed' ? '확정' : '대기'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-md mb-sm">
                        <Clock size={16} color="var(--text-secondary)" />
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {appointment.time}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-md mb-sm">
                        <MapPin size={16} color="var(--text-secondary)" />
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {appointment.location} - {appointment.doctor}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card">
                <div className="card-content text-center">
                  <CalendarIcon size={48} color="var(--text-tertiary)" style={{ margin: '0 auto var(--space-md)' }} />
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-lg)'
                  }}>
                    이 날에는 예약이 없습니다
                  </p>
                  <button
                    onClick={handleNewAppointment}
                    className="btn btn-primary"
                    style={{
                      minHeight: '48px',
                      fontSize: 'var(--text-base)',
                      fontWeight: '600'
                    }}
                  >
                    <Plus size={20} />
                    새 예약 추가
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 바텀 네비게이션 */}
      <BottomNavigation />

      {/* 달력 스타일 */}
      <style jsx>{`
        .calendar-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: var(--space-md);
          justify-items: center;
        }
        
        .calendar-day-header {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-secondary);
          padding: 0;
          height: 32px;
        }
        
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          justify-items: center;
        }
        
        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border-radius: var(--space-sm);
          cursor: pointer;
          transition: var(--transition);
          font-size: var(--text-sm);
          font-weight: 500;
        }

        /* 숫자 가운데 정렬 */
        .calendar-day span {
          display: block;
          width: 100%;
          text-align: center;
        }

        /* 오늘 날짜 원 */
        .calendar-day.today span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #ef4444;
          color: #ffffff;
          margin: 0 auto;
          font-weight: 700;
        }
        
        .calendar-day:not(.empty):hover {
          background: var(--bg-secondary);
        }
        
        /* 예약 원형이 있으므로 별도 배경 제거 */
        
        .appointment-dot {
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: var(--primary);
          border-radius: 50%;
        }
        
        .calendar-day.today .appointment-dot {
          background: var(--text-inverse);
        }
      `}</style>
    </div>
  );
};

export default CalendarPage; 