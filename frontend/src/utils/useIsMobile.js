import { useEffect, useState } from 'react';
import { isMobileDevice } from './deviceUtils';

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  useEffect(() => {
    const handleResize = () => setIsMobile(isMobileDevice());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
} 