import { useEffect, useState } from 'react';

const useIsMiniMobile = () => {
  const [isMiniMobile, setIsMiniMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMiniMobile(window.innerWidth <= 350);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMiniMobile;
};

export default useIsMiniMobile;