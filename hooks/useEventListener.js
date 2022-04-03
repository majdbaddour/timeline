//   https://usehooks.com/useEventListener/

import React, { useRef, useEffect } from "react";

export function useEventListener(eventName, handler, element = window, ...options) {
    // Create a ref that stores handler
    const savedHandler = useRef();

    // Update ref.current value if handler changes.
    // This allows our effect below to always get latest handler ...
    // ... without us needing to pass it in effect deps array ...
    // ... and potentially cause effect to re-run every render.
    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(
        () => {
            // check if element is a ref
            const elementIsRef = element.hasOwnProperty("current");
            const el = elementIsRef ? element.current : element;

            // Make sure element supports addEventListener
            const isSupported = el && el.addEventListener;
            if (!isSupported) return;

            // Create event listener that calls handler function stored in ref
            const eventListener = event => savedHandler.current(event);
            // Add event listener
            el.addEventListener(eventName, eventListener, ...options);
            // Remove event listener on cleanup
            return () => {
                el.removeEventListener(eventName, eventListener, ...options);
            };
        },
        [eventName, element] // Re-run if eventName or element changes
    );
};