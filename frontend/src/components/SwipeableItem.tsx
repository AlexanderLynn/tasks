import { useSwipeable } from 'react-swipeable';
import { ReactNode } from 'react';

interface SwipeableItemProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

const SwipeableItem = ({ children, onSwipeLeft, onSwipeRight, className = '' }: SwipeableItemProps) => {
  const handlers = useSwipeable({
    onSwipedLeft: onSwipeLeft,
    onSwipedRight: onSwipeRight,
    trackMouse: true,
    trackTouch: true,
    delta: 10,
  });

  return (
    <div {...handlers} className={className}>
      {children}
    </div>
  );
};

export default SwipeableItem;
