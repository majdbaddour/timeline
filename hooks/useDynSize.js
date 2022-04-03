import React, { useRef, useLayoutEffect } from 'react';

export const useDynSize = (onChange) => {
    const ref = useRef();

    const measure = () => {
        if (ref.current) {
            const size = ref.current.getBoundingClientRect().toJSON()

            if (onChange) {
                onChange(size);
            }
        }
    }

    useLayoutEffect(() => {
        measure();
    }, [ref.current]);

    return [ref, measure];
}
