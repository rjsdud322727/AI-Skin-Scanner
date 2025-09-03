import { format, parseISO, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { ko } from 'date-fns/locale';

// 날짜 포맷팅 함수들
export const formatDate = (dateString: string, formatString: string = 'yyyy-MM-dd') => {
  return format(parseISO(dateString), formatString, { locale: ko });
};

export const formatDateTime = (dateString: string) => {
  return format(parseISO(dateString), 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
};

export const formatRelativeDate = (dateString: string) => {
  const date = parseISO(dateString);
  
  if (isToday(date)) {
    return '오늘';
  } else if (isThisWeek(date)) {
    return format(date, 'EEEE', { locale: ko });
  } else if (isThisMonth(date)) {
    return format(date, 'MM월 dd일', { locale: ko });
  } else {
    return format(date, 'yy년 MM월 dd일', { locale: ko });
  }
};

// 이미지 처리 함수들
export const resizeImage = (file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // 비율을 유지하면서 리사이즈
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);
      
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(dataUrl);
    };

    img.src = URL.createObjectURL(file);
  });
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// 카메라/갤러리 접근 함수들
export const captureImage = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      reject(new Error('카메라를 지원하지 않는 브라우저입니다.'));
      return;
    }

    navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment', // 후면 카메라 우선
        width: { ideal: 1280 },
        height: { ideal: 720 }
      } 
    })
    .then(stream => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.srcObject = stream;
      video.play();

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx?.drawImage(video, 0, 0);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // 스트림 종료
        stream.getTracks().forEach(track => track.stop());
        
        resolve(dataUrl);
      };
    })
    .catch(reject);
  });
};

// 파일 선택기 함수
export const selectImageFromGallery = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const resizedImage = await resizeImage(file);
          resolve(resizedImage);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('파일이 선택되지 않았습니다.'));
      }
    };
    
    input.click();
  });
};

// 위험도 레벨에 따른 색상 반환
export const getRiskLevelColor = (level: 'low' | 'medium' | 'high') => {
  switch (level) {
    case 'low':
      return 'text-green-600 bg-green-50';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50';
    case 'high':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

// 위험도 레벨 한글 변환
export const getRiskLevelText = (level: 'low' | 'medium' | 'high') => {
  switch (level) {
    case 'low':
      return '낮음';
    case 'medium':
      return '보통';
    case 'high':
      return '높음';
    default:
      return '알 수 없음';
  }
};

// 이메일 유효성 검사
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 전화번호 유효성 검사 (한국 번호 형식)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
  return phoneRegex.test(phone);
};

// 비밀번호 유효성 검사
export const isValidPassword = (password: string): boolean => {
  // 최소 8자, 영문자와 숫자 포함
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

// 전화번호 포맷팅 (자동 하이픈 추가)
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  
  return phone;
};

// 로컬 스토리지 유틸리티
export const storage = {
  get: (key: string) => {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      try {
        return item ? JSON.parse(item) : null;
      } catch {
        return item;
      }
    }
    return null;
  },
  
  set: (key: string, value: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  
  remove: (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
};

// 디바운스 함수
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 클래스명 조합 유틸리티
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
}; 