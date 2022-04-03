

import React, { useRef, useState, useContext, useCallback, useMemo } from 'react';
import { TimelineContext } from "../TimelineContainer";
import { MuiButton, MuiSlider } from "../../../ui/mui";
import { makeStyles } from '@material-ui/core'
import * as config from '../config';

const useStyles = makeStyles(theme => {
    return {
        slider: {
            padding: "8px 0px 0px 20px",
            gridArea: "slider",
        },
        btns: {
            gridArea: "zoomBtns",
            justifySelf: "center",
            alignSelf: "center",
            display: "flex",
            backgroundColor: "#DDE5F0",
            borderRadius: "4px",
        },
        selected: {
            backgroundColor: "#003ECC",
            color: "#FFF",
            height: "25px",
            borderRadius: "4px",
            '&:hover': {
                backgroundColor: "#003ECC",
            },
            fontSize: "0.7rem"
        },
        unselected: {
            backgroundColor: "#DDE5F0",
            color: "#003ECC",
            height: "25px",
            borderRadius: "0px",
            fontSize: "0.7rem"
        },
        today: {
            gridArea: "today",
            alignSelf: "center",
            borderRadius: "4px",
        }
    }
})

const ZoomControls = ({ className }) => {
    const classes = useStyles()
    const { scale, slider, setSlider, calendarMode, setLevel, dateAnchor } = useContext(TimelineContext);

    const [MIN_SLIDER, MAX_SLIDER] = useMemo(() => {
        return [config.scaleToSlider(config.MAX_SCALE), config.scaleToSlider(config.MIN_SCALE)];
    }, [])

    const onCalBtnClick = useCallback((startFn, endFn, name) => {
        setLevel(startFn, endFn, name, dateAnchor)
    }, [setLevel, dateAnchor])
    
    const onTodayBtnClick = useCallback(() => {
        const cal = config.calendar["day"];
        setLevel(cal.startFn, cal.endFn, "day", Date.now())
    }, [setLevel])
    
    const btns = useMemo(() => {
        return Object.keys(config.calendar).filter(key => config.calendar[key].render).map(key => {
            const cal = config.calendar[key];
            return <MuiButton key={cal.name} variant="text" size="medium" onClick={() => onCalBtnClick(cal.startFn, cal.endFn, cal.name)} 
                className={cal.name === calendarMode ? classes.selected : classes.unselected}
                style={cal.name === "year" ? { borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px" }
                    : cal.name === "day" ? { borderBottomRightRadius: "4px", borderTopRightRadius: "4px" } : {}}
            >
                {cal.label}
            </MuiButton>
        })
    }, [calendarMode, onCalBtnClick])

    const onSlider = useCallback((value, done) => {
        // point in time we want to scale around
        // this choice favors using the mid point in the timeline, as it doesn't emphsize the calendar aspect, but the timeline
        // aspect of the control, and the user would be interested in events in the middle
        const t = dateAnchor + scale / 2;

        setSlider(value, t, done);
    }, [setSlider, scale, dateAnchor])

    const onSliderChange = useCallback((e, value) => {
        onSlider(value);
    }, [onSlider])

    const onSliderCommitted = useCallback((e, value) => {
        onSlider(value, true);
    }, [onSlider])

    return (
        <div name="zoom" className={className} >
            <MuiSlider className={classes.slider} value={slider} min={MIN_SLIDER} max={MAX_SLIDER} onChange={onSliderChange} onCommit={onSliderCommitted} aria={"width"} />
            <div className={classes.btns}>
                {btns}
            </div>
            <MuiButton variant="text" size="medium" onClick={onTodayBtnClick} className={`${classes.unselected} ${classes.today}`} >TODAY</MuiButton>
        </div>

    )
}

export default ZoomControls;
