'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FileText, Calendar, Home, Stethoscope } from 'lucide-react';
import type { BottomNavType } from '@/types';

interface BottomNavigationProps {
  className?: string;
  activeTab?: BottomNavType;
  onTabChange?: (tab: BottomNavType) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ className = '', activeTab, onTabChange }) => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      id: 'home',
      label: '홈',
      icon: Home,
      path: '/dashboard',
    },
    {
      id: 'records',
      label: '진료기록',
      icon: FileText,
      path: '/records',
    },
    {
      id: 'appointment',
      label: '진료예약',
      icon: Stethoscope,
      path: '/chat', // AI 도우미(상담+예약) 통합
    },
    {
      id: 'calendar',
      label: '캘린더',
      icon: Calendar,
      path: '/calendar',
    },
  ];

  const handleNavClick = (itemId: string, path: string) => {
    if (onTabChange && ['home','calendar','records','chat'].includes(itemId)) {
      onTabChange(itemId as BottomNavType);
    }
    router.push(path);
  };

  return (
    <div className={`bottom-nav ${className}`}>
      <div className="bottom-nav-content">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, item.path)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="nav-icon">
                <IconComponent size={22} />
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation; 