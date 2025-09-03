// 사용자 타입
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  birthDate: string;
  phoneNumber: string;
  profileImage?: string;
  createdAt: string;
}

// 인증 상태
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

// 진단 결과 타입
export interface DiagnosisResult {
  id: string;
  userId: string;
  image: string;
  diseaseName: string;
  description: string;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  detailedInfo: string;
  symptoms?: string[];
  diagnosisDate: string;
}

// 예약 타입
export interface Appointment {
  id: string;
  userId: string;
  date: string;
  time: string;
  hospitalName: string;
  doctorName: string;
  purpose: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

// 챗봇 메시지 타입
export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
}

// 진단 상태 관리
export interface DiagnosisState {
  results: DiagnosisResult[];
  currentDiagnosis: DiagnosisResult | null;
  isLoading: boolean;
  addDiagnosisResult: (result: Omit<DiagnosisResult, 'id'>) => void;
  setCurrentDiagnosis: (diagnosis: DiagnosisResult | null) => void;
  deleteDiagnosisResult: (id: string) => void;
}

// 예약 상태 관리
export interface AppointmentState {
  appointments: Appointment[];
  isLoading: boolean;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
}

// 챗봇 상태 관리
export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  sendMessage: (message: string) => Promise<void>;
}

// 네비게이션 타입
export type BottomNavType = 'home' | 'chat' | 'calendar' | 'records';

// 카메라 모드
export type CameraMode = 'camera' | 'gallery';

// API 응답 타입들
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Mock 데이터용 인터페이스
export interface MockDiagnosisResponse {
  diseaseName: string;
  description: string;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  detailedInfo: string;
  symptoms?: string[];
} 