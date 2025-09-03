import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '@/types';

// Mock 사용자 데이터 (실제 백엔드 연결 전까지 사용)
const mockUsers: User[] = [
  {
    id: '1',
    name: '홍길동',
    email: 'test@example.com',
    password: 'password123',
    birthDate: '1990-01-01',
    phoneNumber: '010-1234-5678',
    profileImage: '',
    createdAt: new Date().toISOString(),
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string): Promise<boolean> => {
        // Mock 로그인 로직 (실제 API 호출로 대체 예정)
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      register: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
        try {
          // 이메일 중복 확인
          const existingUser = mockUsers.find(u => u.email === userData.email);
          if (existingUser) {
            return false;
          }

          // Mock 사용자 등록 (실제 API 호출로 대체 예정)
          const newUser: User = {
            ...userData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          };

          mockUsers.push(newUser);
          
          // 등록 후 자동 로그인은 하지 않음 (로그인 화면으로 이동)
          return true;
        } catch (error) {
          console.error('Registration error:', error);
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...updates };
          set({ user: updatedUser });
          
          // Mock 데이터 업데이트
          const userIndex = mockUsers.findIndex(u => u.id === user.id);
          if (userIndex !== -1) {
            mockUsers[userIndex] = updatedUser;
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
); 