import { useEffect, useRef } from 'react';

export const useThrottleFunc = () => {
    const lastExecuted = useRef(Date.now());
    const timerId = useRef();

    const runF = (f) => {
        lastExecuted.current = Date.now();
        f();
    }

    const clearTimer = () => {
        if (timerId.current) {
            clearTimeout(timerId.current);
        }
    }

    const throttle = (f, timeout = 500) => {
        clearTimer();

        if (Date.now() >= lastExecuted.current + timeout) {
            runF(f);
        }
        else {
            timerId.current = setTimeout(() => runF(f), timeout);
        }
    }

    useEffect(() => {
        return () => clearTimer();
    }, [])

    return throttle;
}

