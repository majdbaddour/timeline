import React, { useRef, useState, useContext, useCallback, useMemo, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { TimelineContext } from "../TimelineContainer";
import { makeStyles } from '@material-ui/core'
import * as config from '../config';
import { useMousePos, useEventListener } from '../../../../hooks';
import { Labels, RowHandler } from './';

const useStyles = makeStyles(theme => {
    return {
        dateLabels: {
            overflow: "hidden",
            position: "relative",
            borderBottom: "1px solid #CCC",
            transition: "all 0ms",
        },
        row: {
            overflow: "hidden",
            position: "relative",
            height: "50px",
            borderBottom: "1px solid #CCC",
            '&:last-child': {
                borderBottom: "unset",
            },
            transition: "all 0ms",
        }
    }
})

const LIGHT = "hsl(218, 45%, 92%)";
const DARK = "hsl(220, 37%, 90%)";

const Timeline = ({ rows, className }) => {
    const classes = useStyles();
    const { dateAnchor, timelineWidth, onDrag, onZoom, unitWidth, unitOffset } = useContext(TimelineContext);

    const ref = useRef();
    const mousePosRef = useMousePos(ref);
    const isDragging = useRef(false);
    const title = useRef("");

    const onZooming = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e?.srcElement?.parentElement?.classList?.value?.includes("noWheel") ||
            e?.srcElement?.classList?.value?.includes("noWheel")) return;
        if (isDragging.current) return;
        if (isNaN(e.deltaY)) return;
        onZoom(Math.sign(e.deltaY), mousePosRef.current.x)
    }

    useEventListener("wheel", onZooming, ref);

    const [divWidth, divLeft, minLeft, maxLeft] = useMemo(() => {
        return config.getWidths(timelineWidth);
    }, [timelineWidth])

    const pointerDown = useCallback((e) => {
        const classValue = e?.target?.classList?.value;
        if (classValue?.includes("noWheel") || classValue === "") return;

        ref.current.setPointerCapture(e.pointerId);
        isDragging.current = true;
    }, [ref.current])

    const pointerMove = useCallback((e) => {
        e.preventDefault();
        if (isDragging.current) {
            onDrag(e.movementX);
        };
    }, [dateAnchor])

    const pointerUp = useCallback((e) => {
        e.preventDefault();
        onDrag(e.movementX, true);
        isDragging.current = false;
    })

    const nw = timelineWidth * config.twMultiplier;
    const rowStyle = { width: `${divWidth}px`, left: `${divLeft}px`, transition: "all 0ms", };
    const background = { background: `repeating-linear-gradient(to right, ${LIGHT} ${nw + unitOffset}px, ${LIGHT} ${nw + unitOffset + unitWidth}px, ${DARK} ${nw + unitOffset + unitWidth}px, ${DARK} ${nw + unitOffset + 2 * unitWidth}px) ${0/* unitWidth */}px` };
    const viewportStyle = { width: `${timelineWidth}px` };

    return (
        <div ref={ref} name="timeline" className={className} style={viewportStyle}
            onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp}
        >
            <Labels name={`Labels`} className={`${classes.dateLabels} timeline-row`} style={{ ...rowStyle }} />
            {rows.map((row, idx) => {
                return <div title={title.current} name={`Timeline-${idx + 1}`} key={`${row.sourceType}-${idx}`} className={`${classes.row} timeline-row`} style={{ ...rowStyle, ...background }} >
                        <RowHandler row={row} rowIndex={idx} />
                    </div>
            })}
            <div name={`Timeline-0`} className={`${classes.row} timeline-row`} style={{ ...rowStyle, ...background }} ></div>
        </div>
    )
}

export default Timeline;
