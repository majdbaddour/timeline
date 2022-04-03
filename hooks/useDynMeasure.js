
import { useDynSize, useEventListener, useThrottleFunc } from './';

export const useDynMeasure = (onChange, timeout = 500) => {
    const throttle = useThrottleFunc();

    const onSizeChange = (size) => {
        onChange(size);
    }

    const [ref, measure] = useDynSize(onSizeChange);

    const onResize = (e) => {
        throttle(measure, timeout);
    }

    useEventListener("resize", onResize);

    return [ref, measure];
}
