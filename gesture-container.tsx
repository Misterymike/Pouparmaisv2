import { ReactNode } from 'react';
import { useGesture } from '@/hooks/use-gesture';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

interface GestureContainerProps {
  children: ReactNode;
  onRefresh?: () => void;
}

const ROUTES = ['/dreams', '/games', '/news', '/wallet'];

export function GestureContainer({ children, onRefresh }: GestureContainerProps) {
  const [location, setLocation] = useLocation();

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentIndex = ROUTES.indexOf(location);
    if (currentIndex === -1) return;

    if (direction === 'left' && currentIndex < ROUTES.length - 1) {
      setLocation(ROUTES[currentIndex + 1]);
    } else if (direction === 'right' && currentIndex > 0) {
      setLocation(ROUTES[currentIndex - 1]);
    }
  };

  useGesture({
    onSwipeLeft: () => handleSwipe('left'),
    onSwipeRight: () => handleSwipe('right'),
    onSwipeDown: onRefresh,
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen w-full touch-pan-y"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
