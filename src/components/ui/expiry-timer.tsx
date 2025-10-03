import React, { useState, useEffect, useCallback } from 'react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpiryTimerProps {
  createdAt: string;
  expiryMinutes?: number;
  status: string;
  className?: string;
}

interface TimeRemaining {
  minutes: number;
  seconds: number;
  isExpired: boolean;
  isWarning: boolean;
  isCritical: boolean;
}

export const ExpiryTimer: React.FC<ExpiryTimerProps> = ({
  createdAt,
  expiryMinutes = 30,
  status,
  className
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    minutes: 0,
    seconds: 0,
    isExpired: false,
    isWarning: false,
    isCritical: false
  });

  const calculateTimeRemaining = useCallback((): TimeRemaining => {
    try {
      const createdTime = new Date(createdAt).getTime();
      
      // Validate the created time
      if (isNaN(createdTime)) {
        return {
          minutes: 0,
          seconds: 0,
          isExpired: true,
          isWarning: false,
          isCritical: false
        };
      }

      const expiryTime = createdTime + (expiryMinutes * 60 * 1000);
      const now = Date.now();
      const timeDiff = expiryTime - now;

      if (timeDiff <= 0) {
        return {
          minutes: 0,
          seconds: 0,
          isExpired: true,
          isWarning: false,
          isCritical: false
        };
      }

      const minutes = Math.floor(timeDiff / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      const warningThreshold = Math.max(6, expiryMinutes * 0.2); // Warning when 6 minutes or 20% remaining
      const criticalThreshold = Math.max(2, expiryMinutes * 0.1); // Critical when 2 minutes or 10% remaining

      return {
        minutes,
        seconds,
        isExpired: false,
        isWarning: minutes <= warningThreshold,
        isCritical: minutes <= criticalThreshold
      };
    } catch (error) {
      console.error('Error calculating time remaining:', error);
      return {
        minutes: 0,
        seconds: 0,
        isExpired: true,
        isWarning: false,
        isCritical: false
      };
    }
  }, [createdAt, expiryMinutes]);

  useEffect(() => {
    // Only show timer for NEW status enquiries
    if (status.toLowerCase() !== 'new') {
      return;
    }

    const updateTimer = () => {
      setTimeRemaining(calculateTimeRemaining());
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [status, calculateTimeRemaining]);

  // Don't render timer for non-NEW status enquiries
  if (status.toLowerCase() !== 'new') {
    return (
      <div className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
        "bg-green-100 text-green-700 border border-green-200",
        className
      )}>
        <CheckCircle className="h-3 w-3" />
        <span>Processed</span>
      </div>
    );
  }

  const { minutes, seconds, isExpired, isWarning, isCritical } = timeRemaining;

  if (isExpired) {
    return (
      <div className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
        "bg-red-100 text-red-700 border border-red-200 animate-pulse",
        className
      )}>
        <AlertTriangle className="h-3 w-3" />
        <span>Expired</span>
      </div>
    );
  }

  const getTimerStyles = () => {
    if (isCritical) {
      return "bg-red-100 text-red-700 border-red-200 animate-pulse";
    }
    if (isWarning) {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  const getProgressColor = () => {
    if (isCritical) return "bg-red-500";
    if (isWarning) return "bg-orange-500";
    return "bg-blue-500";
  };

  const progressPercentage = Math.max(0, Math.min(100, ((minutes * 60 + seconds) / (expiryMinutes * 60)) * 100));

  return (
    <div className={cn(
      "flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium border transition-all duration-300 w-[120px]",
      getTimerStyles(),
      className
    )}>
      <div className="flex items-center gap-1">
        <Clock className={cn(
          "h-3 w-3",
          isCritical ? "animate-pulse" : ""
        )} />
        <span className={cn(
          "font-mono tabular-nums",
          isCritical ? "animate-pulse" : ""
        )}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-8 h-1 bg-white/50 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-1000 ease-linear",
            getProgressColor()
          )}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ExpiryTimer;
