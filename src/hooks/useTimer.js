import { useState, useEffect, useRef } from 'react';

export const useTimer = (startedAt, durationMinutes = 25, onExpire) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const onExpireRef = useRef(onExpire);
  
  // Keep the callback updated
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!startedAt) return;

    const startTime = new Date(startedAt).getTime();
    const durationMs = durationMinutes * 60 * 1000;
    const endTime = startTime + durationMs;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = endTime - now;
      
      if (difference <= 0) {
        setTimeLeft(0);
        if (onExpireRef.current) {
          onExpireRef.current();
        }
        return false;
      }
      
      setTimeLeft(Math.floor(difference / 1000));
      return true;
    };

    // Run once on mount
    const isActive = calculateTimeLeft();
    if (!isActive) return;

    const intervalId = setInterval(() => {
      const active = calculateTimeLeft();
      if (!active) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startedAt, durationMinutes]);

  const formatTime = () => {
    if (timeLeft === null) return '00:00';
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft,
    formatTime,
    isExpired: timeLeft === 0
  };
};
