import { useRef } from "react";
import { useEventListener } from "./";

export const useMousePos = (ref) => {
    const mousePosRef = useRef();

    useEventListener("mousemove", e => {
        mousePosRef.current = { x: e.offsetX, y: e.offsetY }
    }, ref);

    return mousePosRef;
}
