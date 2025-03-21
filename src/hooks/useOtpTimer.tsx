import { useEffect, useState } from "react";

const TIMER_KEY = "otp_timer"; //Key for session storage
const INITIAL_TIMER = 60; //Set initial timer value

export const useOtpTimer = () => {
  const [timer, setTimer] = useState<number>(() => {
    const storedTime = sessionStorage.getItem(TIMER_KEY);
    return storedTime ? parseInt(storedTime, 10) : INITIAL_TIMER;
  });
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    if (!isTimerActive) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setIsTimerActive(false);
          sessionStorage.removeItem(TIMER_KEY); //Clear timer after completion
          return INITIAL_TIMER;
        }
        sessionStorage.setItem(TIMER_KEY, (prev - 1).toString()); //Store in sessionStorage
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive]);

  //Function to start the timer
  const startTimer = () => {
    sessionStorage.setItem(TIMER_KEY, INITIAL_TIMER.toString());
    setTimer(INITIAL_TIMER);
    setIsTimerActive(true);
  };

  return { timer, isTimerActive, startTimer };
};
