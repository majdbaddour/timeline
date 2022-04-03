import React, { useState, createContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core'
import { Timeline, DatasetSelector, ZoomControls, DateNav } from './subs';
import * as config from './config';
import { useDynMeasure } from '../../../hooks';
import { selectDataSet, selectPoint, setDateAnchor, setAnchorScaleSlider } from '../../../redux/reducers/timeline';

export const TimelineContext = createContext({});
const selectorWidth = 180;

const useStyles = makeStyles(theme => {
    return {
        root: {
            display: "grid",
            gridTemplateAreas: `"col1 col2"`,
            position: 'relative',
            transition: "all 0ms",
        },

        col1: {
            gridArea: "col1",
            display: "grid",
            gridTemplateAreas: `"dateControls"
                                "dataSets"
                                "bottom"`,
            gridTemplateRows: "35px auto 40px",
            borderRight: "1px solid #CCC",
            transition: "all 0ms",
        },
        col2: {
            gridArea: "col2",
            display: "grid",
            gridTemplateAreas: `"timeline"
                                "zoomControls"`,
            gridTemplateRows: "auto 40px",
            overflow: "hidden",
            transition: "all 0ms",
        },

        dateNav: {
            gridArea: "dateControls",
            borderBottom: "1px solid #CCC",
        },
        dataSets: {
            gridArea: "dataSets",
        },
        bottom: {
            gridArea: "bottom",
        },

        timeline: {
            gridArea: "timeline",
            borderBottom: "1px solid #CCC",

            display: "grid",
            gridTemplateRows: "35px auto",
            position: "relative",
        },
        zoomControls: {
            gridArea: "zoomControls",
            display: "grid",
            gridTemplateAreas: `"slider zoomBtns today _"`,
            gridTemplateColumns: "1fr 2fr 80px 10px",
            transition: "all 0ms",
        },

        dateLabels: {
            borderBottom: "1px solid #CCC",
        },
        row: {
            height: "50px",
            borderBottom: "1px solid #CCC",
            '&:last-child': {
                borderBottom: "unset",
            }
        }
    }
})

const TimelineContainer = ({ leftPosition }) => {
    const classes = useStyles();

    const sourceType = useSelector(state => state.search?.searchType);
    const search = useSelector(state => state.search?.searchResult?.results);
    const resources = useSelector(state => state.jobs?.resources);
    const dasAlerts = useSelector(state => state.alerts?.alertsResult);
    const pasAlerts = useSelector(state => state.alerts?.pasAlertsResult);

    const zoomingFactor = useSelector(state => state.timeline.zoomingFactor);
    const dateAnchorValue = useSelector(state => state.timeline.dateAnchor);
    const scaleValue = useSelector(state => state.timeline.scale);
    const sliderValue = useSelector(state => state.timeline.slider);
    const selectedSets = useSelector(state => state.timeline.selectedSets);
    const calendarModeValue = useSelector(state => state.timeline.calendarMode);
    
    const availableSets = config.getAvailableDataSets({ search, resources, dasAlerts, pasAlerts }, sourceType);
    const rows = selectedSets.map(ss => availableSets.find(ads => ads.key === ss)).filter(item => item);

    const [dateAnchor, setDateAnchorLoc] = useState(dateAnchorValue);
    const [scale, setScaleLoc] = useState(scaleValue);
    const [slider, setSliderLoc] = useState(sliderValue);
    const [calendarMode, setCalendarModeLoc] = useState(calendarModeValue);
    const [portWidth, setPortWidth] = useState(600);
    
    const dispatch = useDispatch();

    const onSizeChange = (size) => {
        setPortWidth(size.width);
    }

    const [ref, measure] = useDynMeasure(onSizeChange)

    const timelineWidth = useMemo(() => {
        return portWidth - selectorWidth;
    }, [portWidth]);

    useEffect(() => {
        if (dateAnchor === 0) {
            const month = config.calendar.month;
            setLevel(month.startFn, month.endFn, month.name, Date.now());
        }
    }, [])

    useEffect(() => {
        setDateAnchorLoc(dateAnchorValue);
    }, [dateAnchorValue])

    useEffect(() => {
        setScaleLoc(scaleValue);
    }, [scaleValue])

    useEffect(() => {
        setSliderLoc(sliderValue);
    }, [sliderValue])

    useEffect(() => {
        setCalendarModeLoc(calendarModeValue);
    }, [calendarModeValue])

    useEffect(() => {
        measure();
    }, [leftPosition])

    const onDragTime = useCallback((dt, done = false) => {
        if (done) {
            dispatch(setDateAnchor(dateAnchor - dt));
        }
        else {
            setDateAnchorLoc(dateAnchor - dt);
            setCalendarModeLoc("");
        }
    }, [dateAnchor])

    const onDrag = useCallback((dx, done = false) => {
        const dt = config.getTimeDelta(dx, scale, timelineWidth);
        onDragTime(dt, done);
    }, [onDragTime, scale, timelineWidth])

    const onZoom = useCallback((deltaY, x) => {
        const scaleFactor = deltaY > 0 ? zoomingFactor : 1 / zoomingFactor;

        let newScale = scale * scaleFactor;
        if (newScale < config.MIN_SCALE) newScale = config.MIN_SCALE;
        if (newScale > config.MAX_SCALE) newScale = config.MAX_SCALE;

        const mouseT = config.getPositionTime(x, dateAnchor, scale, timelineWidth); // mouse position in the time domain

        setScale(newScale, mouseT);
    }, [scale, dateAnchor, timelineWidth, zoomingFactor, leftPosition])

    const setScale = useCallback((newScale, t) => {
        // scaling takes place around the point t in the time domain
        const newDateAnchor = config.getNewDateAnchor(t, dateAnchor, scale, newScale); // new t1 value
        const newSlider = config.scaleToSlider(newScale);
        
        dispatch(setAnchorScaleSlider(newDateAnchor, newScale, newSlider, ""));
    }, [dateAnchor, scale])

    const setSlider = useCallback((newSlider, t, done) => {
        // scaling takes place around the point t in the time domain
        const newScale = config.sliderToScale(newSlider);
        const newDateAnchor = config.getNewDateAnchor(t, dateAnchor, scale, newScale); // new t1 value

        if (!done) {
            setSliderLoc(newSlider);
            setDateAnchorLoc(newDateAnchor);
            setScaleLoc(newScale);
            setCalendarModeLoc("");
        }
        else {
            dispatch(setAnchorScaleSlider(newDateAnchor, newScale, newSlider, ""));
        }
    }, [dateAnchor, scale])

    const setLevel = useCallback((startFn, endFn, name, t) => {
        const startAt = startFn(t);
        const endAt = endFn(t);
        const newSlider = config.scaleToSlider(endAt - startAt);
        dispatch(setAnchorScaleSlider(startAt, endAt - startAt, newSlider, name));
    }, [])

    const { labels, unitWidth, unitOffset } = useMemo(() => {
        const res = config.generateLabels(dateAnchor, scale, timelineWidth, calendarMode);
        return res;
    }, [dateAnchor, scale, timelineWidth, calendarMode])

    const selectSet = useCallback((name, selected) => {
        dispatch(selectDataSet(name, selected));
    }, [])

    const onPointClick = (cluster, rowIndex) => {
        dispatch(selectPoint(cluster, rows[rowIndex].sourceType, rows[rowIndex].subType));
    }

    return (
        <TimelineContext.Provider value={{
            timelineWidth, dateAnchor, 
            onDragTime, onDrag, onZoom, onPointClick,
            scale, setScale,
            slider, setSlider,
            calendarMode, setLevel,
            selectedSets, selectSet,
            labels, unitWidth, unitOffset,
        }}>
            <div ref={ref} className={classes.root} style={{ gridTemplateColumns: `${selectorWidth}px 1fr` }}>
                <div className={classes.col1} style={{}}>
                    <DateNav className={classes.dateNav} />
                    <DatasetSelector className={classes.dataSets} rows={rows} availableSets={availableSets} />
                    <div className={classes.bottom}></div>
                </div>
                <div name="col2" className={classes.col2} style={{ maxWidth: `${timelineWidth}px` }} >
                    <Timeline className={classes.timeline} rows={rows} />
                    <ZoomControls className={classes.zoomControls} />
                </div>
            </div>
        </TimelineContext.Provider>
    )
}

export default TimelineContainer;
