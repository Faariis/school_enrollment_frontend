import { useEffect, useState } from 'react';

const useIsMiniTablet = () => {
    const [isMiniTablet, setIsMiniTablet] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMiniTablet(window.innerWidth > 760 && window.innerWidth < 1200);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMiniTablet;
};

export default useIsMiniTablet;