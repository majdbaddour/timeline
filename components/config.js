/**
    vw = timeline view port (used here also to refer to its width) 
    n = number of vw multipliers on either side of vw
    dw = moving div element inside vw (used here also to refer to its width) 
    dw = (2n+1) * vw

    here vw is in the middle of dw

    d0                    d1      d   d2                    d3
    ---------------------------------------------------------
    |                     |     vw     |                    |
    ---------------------------------------------------------
    t0            ot1     t1      t   t2   ot2              t3
                          et1         et2

    if we set d1 = 0 we get:
    d0 = -n * vw
    d1 = 0
    d2 = vw
    d3 = (n+1) * vw

    t0, t1, t2, t3: time points corresponding to d0, d1, d2, d3

    From the above:
    vw = (d2 - d1) in the space domain = (t2 - t1) in the time domain

    For a apoint in time t, corresponding to the point in space d, we have:
    (t - t1)/(t2 - t1) = (d - d1)/(d2 - d1)

    Substituting d1 = 0, t2 - t1 = scale, d2 - d1 = vw (viewport width):
    (t - t1)/scale = d/vw, or

        d = (t - t1) * vw / scale      <---- positioning formula on vw
    
    We can derive the deltas formula by putting d - d1 = dx, and t - t1 = dt
    
        dt = dx * scale / vw            <---- dragging formula

    The positioning formula above will be used to position points after adding (d1 - d0) = n * vw, since we're positioning points on the dw div, not vw:

        d = n * vw + (t - t1) * vw / scale       
        d = vw * (n + ((t - t1) / scale))    <---- positioning formula on dw

    vw / scale is the conversion factor between time and space: 
    cf = vw / scale

    When zooming in/out, the center of the scaling transform is the mouse position. 
    Therefore, if point d is the mouse posoition, corresponding to point t: neither point should change due to the transform:
    (old t2 - old t1) = (ot2 - ot1) = old scale = s1
    (new t2 - new t1) = (et2 - et1) = new scale = s2

    (t - t1)/(t2 - t1) = (t - et1)/(et2 - et1)
    (t - t1)/s1 = (t - et1)/s2
    (t - t1) * s2/s1 = (t - et1)

    et1 = t - (t - t1) * s2/s1     <----- formula for deriving new date anchor time value et1 from old anchor t1, and the old and new scale values, after zooming in/out
    
    From positioning formula on vw above
    t - t1 = d * scale / vw

    t = t1 + d * scale / vw   <----- time value from position in vw reference frame

    In the dw reference frame the mouse position d is expressed in reference to d0, therefore to trnasform it back to the vw frame we replace d => d - n * vw:
    t = t1 + (d - n * vw) * scale / vw 
   
    t = t1 + (d / vw - n) * scale  <----- time value from position in dw reference frame

 */

export const twMultiplier = 0.5; // n
export const sliderMultiplier = 5.0;
export const ICON_WIDTH = 10;
export const CLUSTER_WIDTH = 25;

export const getDivWidth = (vw) => (2 * twMultiplier + 1) * vw; // dw
export const getDivLeft = (vw) => - twMultiplier * vw; // d0
export const getMinMaxLeft = (vw) => [- 2 * twMultiplier * vw, 0]; // 2d0, d1
export const getWidths = (vw) => [getDivWidth(vw), getDivLeft(vw), ...getMinMaxLeft(vw)];
export const getMinMaxPosition = (vw) => [- twMultiplier * vw, (twMultiplier + 1) * vw]; // d0, d3

export const getPosition = (t, dateAnchor, scale, timelineWidth) => {
    // d = vw * (n + ((t - t1) / scale))   <---- positioning formula on dw
    return timelineWidth * (twMultiplier + ((t - dateAnchor) / scale))
}

export const getPositionTime = (d, dateAnchor, scale, timelineWidth) => {
    // t = t1 + (d / vw - n) * scale   <----- time value from position in dw reference frame
    return dateAnchor + (d / timelineWidth - twMultiplier) * scale
}

export const getNewDateAnchor = (t, oldDateAnchor, oldScale, newScale) => {
    // et1 = t - (t - t1) * s2/s1   <----- formula for deriving new date anchor
    return t - (t - oldDateAnchor) * newScale / oldScale;
}

export const getTimeDelta = (dx, scale, timelineWidth) => {
    // dt = dx * scale / vw    <---- dragging formula
    return dx * scale / timelineWidth;
}

export const getPositionDelta = (dt, scale, timelineWidth) => {
    // dx  = dt * vw  / scale    <---- width and offset formula
    return dt * timelineWidth / scale;
}

export const scaleToSlider = (scale) => {
    const slider = -sliderMultiplier * Math.log10(scale / ONE_SECOND); // convert scale to seconds, this makes the slider value for a scale of 1 second = 0, the maximmum value
    return slider;
}

export const sliderToScale = (slider) => {
    return ONE_SECOND * 10 ** (-slider / sliderMultiplier); // restore to milliseconds
}

// fixed time spans in milli seconds
const ONE_SECOND = 1000.0;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_WEEK = 7 * ONE_DAY;

export const MIN_SCALE = ONE_SECOND;
export const MAX_SCALE = ONE_DAY * 365.25 * 10;

export const getDecadeStart = (dateInMilliSeconds) => {
    const date = new Date(dateInMilliSeconds);
    const start = new Date(date.getFullYear() - date.getFullYear() % 10, 0, 1, 0, 0, 0, 0, 0);
    return start.getTime();
}

export const getDecadeEnd = (dateInMilliSeconds) => {
    const date = new Date(dateInMilliSeconds);
    const end = new Date(9 + date.getFullYear() - date.getFullYear() % 10, 12, 0, 23, 59, 59, 999);
    return end.getTime();
}

export const nextDecade = () => {
    const startFn = (dateInMilliSeconds) => getDecadeEnd(dateInMilliSeconds) + 1;
    const endFn = (dateInMilliSeconds) => getDecadeEnd(getDecadeEnd(dateInMilliSeconds) + ONE_DAY);
    return [startFn, endFn];
}

export const prevDecade = () => {
    const startFn = (dateInMilliSeconds) => getDecadeStart(getDecadeStart(dateInMilliSeconds) - ONE_DAY);
    const endFn = (dateInMilliSeconds) => getDecadeStart(dateInMilliSeconds) - 1;
    return [startFn, endFn];
}

export const getYearStart = (dateInMilliSeconds) => {
    const date = new Date(dateInMilliSeconds);
    const start = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0, 0);
    return start.getTime();
}

export const getYearEnd = (dateInMilliSeconds) => {
    const date = new Date(dateInMilliSeconds);
    const end = new Date(date.getFullYear(), 12, 0, 23, 59, 59, 999);
    return end.getTime();
}

export const nextYear = () => {
    const startFn = (dateInMilliSeconds) => getYearEnd(dateInMilliSeconds) + 1;
    const endFn = (dateInMilliSeconds) => getYearEnd(getYearEnd(dateInMilliSeconds) + ONE_DAY);
    return [startFn, endFn];
}

export const prevYear = () => {
    const startFn = (dateInMilliSeconds) => getYearStart(getYearStart(dateInMilliSeconds) - ONE_DAY);
    const endFn = (dateInMilliSeconds) => getYearStart(dateInMilliSeconds) - 1;
    return [startFn, endFn];
}

export const getMonthStart = (dateInMilliSeconds) => {
    const date = new Date(dateInMilliSeconds);
    const start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
    return start.getTime();
}

export const getMonthEnd = (dateInMilliSeconds) => {
    const date = new Date(dateInMilliSeconds);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    return end.getTime();
}

export const nextMonth = () => {
    const startFn = (dateInMilliSeconds) => getMonthEnd(dateInMilliSeconds) + 1;
    const endFn = (dateInMilliSeconds) => getMonthEnd(getMonthEnd(dateInMilliSeconds) + ONE_DAY);
    return [startFn, endFn];
}

export const prevMonth = () => {
    const startFn = (dateInMilliSeconds) => getMonthStart(getMonthStart(dateInMilliSeconds) - ONE_DAY);
    const endFn = (dateInMilliSeconds) => getMonthStart(dateInMilliSeconds) - 1;
    return [startFn, endFn];
}

export const getWeekStart = (dateInMilliSeconds) => {
    const date = new Date(dateInMilliSeconds);
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay(), 0, 0, 0, 0);
    return start.getTime();
}

export const getWeekEnd = (dateInMilliSeconds) => {
    const date = new Date(dateInMilliSeconds);
    const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 6, 23, 59, 59, 999);
    return end.getTime();
}

export const nextWeek = () => {
    const startFn = (dateInMilliSeconds) => getWeekStart(getWeekEnd(dateInMilliSeconds) + ONE_DAY);
    const endFn = (dateInMilliSeconds) => getWeekEnd(getWeekEnd(dateInMilliSeconds) + ONE_DAY);
    return [startFn, endFn];
}

export const prevWeek = () => {
    const startFn = (dateInMilliSeconds) => getWeekStart(getWeekStart(dateInMilliSeconds) - ONE_DAY);
    const endFn = (dateInMilliSeconds) => getWeekEnd(getWeekStart(dateInMilliSeconds) - ONE_DAY);
    return [startFn, endFn];
}

export const getDayStart = (dateInMilliSeconds) => {
    const date = new Date(dateInMilliSeconds);
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    return start.getTime();
}

export const getDayEnd = (dateInMilliSeconds) => {
    const date = new Date(dateInMilliSeconds);
    const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
    return end.getTime();
}

export const nextDay = () => {
    const startFn = (dateInMilliSeconds) => getDayStart(getDayEnd(dateInMilliSeconds) + 2 * ONE_HOUR);
    const endFn = (dateInMilliSeconds) => getDayEnd(getDayEnd(dateInMilliSeconds) + 2 * ONE_HOUR);
    return [startFn, endFn];
}

export const prevDay = () => {
    const startFn = (dateInMilliSeconds) => getDayStart(getDayStart(dateInMilliSeconds) - 2 * ONE_HOUR);
    const endFn = (dateInMilliSeconds) => getDayEnd(getDayStart(dateInMilliSeconds) - 2 * ONE_HOUR);
    return [startFn, endFn];
}

export const getHourStart = (dateInMilliSeconds) => {
    const date = new Date(dateInMilliSeconds);
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0, 0);
    return start.getTime();
}

export const getHourEnd = (dateInMilliSeconds) => {
    return getHourStart(dateInMilliSeconds) + ONE_HOUR - 1;
}

export const nextHour = () => {
    const startFn = (dateInMilliSeconds) => getHourStart(dateInMilliSeconds) + ONE_HOUR;
    const endFn = (dateInMilliSeconds) => getHourEnd(dateInMilliSeconds) + ONE_HOUR;
    return [startFn, endFn];
}

export const prevHour = () => {
    const startFn = (dateInMilliSeconds) => getHourStart(dateInMilliSeconds) - ONE_HOUR;
    const endFn = (dateInMilliSeconds) => getHourEnd(dateInMilliSeconds) - ONE_HOUR;
    return [startFn, endFn];
}

export const getMinutes5Start = (dateInMilliSeconds) => {
    const date = new Date(dateInMilliSeconds);
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() - date.getMinutes() % 5, 0, 0);
    return start.getTime();
}

export const getMinutes5End = (dateInMilliSeconds) => {
    return getMinutes5Start(dateInMilliSeconds) + 5 * ONE_MINUTE - 1;
}

export const nextMinutes5 = () => {
    const startFn = (dateInMilliSeconds) => getMinutes5Start(dateInMilliSeconds) + 5 * ONE_MINUTE;
    const endFn = (dateInMilliSeconds) => getMinutes5End(dateInMilliSeconds) + 5 * ONE_MINUTE;
    return [startFn, endFn];
}

export const prevMinutes5 = () => {
    const startFn = (dateInMilliSeconds) => getMinutes5Start(dateInMilliSeconds) - 5 * ONE_MINUTE;
    const endFn = (dateInMilliSeconds) => getMinutes5End(dateInMilliSeconds) - 5 * ONE_MINUTE;
    return [startFn, endFn];
}

export const getMinuteStart = (dateInMilliSeconds) => {
    const date = new Date(dateInMilliSeconds);
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0, 0);
    return start.getTime();
}

export const getMinuteEnd = (dateInMilliSeconds) => {
    return getMinuteStart(dateInMilliSeconds) + ONE_MINUTE - 1;
}

export const nextMinute = () => {
    const startFn = (dateInMilliSeconds) => getMinuteStart(dateInMilliSeconds) + ONE_MINUTE;
    const endFn = (dateInMilliSeconds) => getMinuteEnd(dateInMilliSeconds) + ONE_MINUTE;
    return [startFn, endFn];
}

export const prevMinute = () => {
    const startFn = (dateInMilliSeconds) => getMinuteStart(dateInMilliSeconds) - ONE_MINUTE;
    const endFn = (dateInMilliSeconds) => getMinuteEnd(dateInMilliSeconds) - ONE_MINUTE;
    return [startFn, endFn];
}



export const getSeconds5Start = (dateInMilliSeconds) => {
    const date = new Date(dateInMilliSeconds);
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() - date.getSeconds() % 5, 0);
    return start.getTime();
}

export const getSeconds5End = (dateInMilliSeconds) => {
    return getSeconds5Start(dateInMilliSeconds) + 5 * ONE_SECOND - 1;
}

export const nextSeconds5 = () => {
    const startFn = (dateInMilliSeconds) => getSeconds5Start(dateInMilliSeconds) + 5 * ONE_SECOND;
    const endFn = (dateInMilliSeconds) => getSeconds5End(dateInMilliSeconds) + 5 * ONE_SECOND;
    return [startFn, endFn];
}

export const prevSeconds5 = () => {
    const startFn = (dateInMilliSeconds) => getSeconds5Start(dateInMilliSeconds) - 5 * ONE_SECOND;
    const endFn = (dateInMilliSeconds) => getSeconds5End(dateInMilliSeconds) - 5 * ONE_SECOND;
    return [startFn, endFn];
}

export const getSecondStart = (dateInMilliSeconds) => {
    const date = new Date(dateInMilliSeconds);
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);
    return start.getTime();
}

export const getSecondEnd = (dateInMilliSeconds) => {
    return getSecondStart(dateInMilliSeconds) + ONE_SECOND - 1;
}

export const nextSecond = () => {
    const startFn = (dateInMilliSeconds) => getSecondStart(dateInMilliSeconds) + ONE_SECOND;
    const endFn = (dateInMilliSeconds) => getSecondEnd(dateInMilliSeconds) + ONE_SECOND;
    return [startFn, endFn];
}

export const prevSecond = () => {
    const startFn = (dateInMilliSeconds) => getSecondStart(dateInMilliSeconds) - ONE_SECOND;
    const endFn = (dateInMilliSeconds) => getSecondEnd(dateInMilliSeconds) - ONE_SECOND;
    return [startFn, endFn];
}

export const getSubSecondStart = (dateInMilliSeconds) => {
    const date = new Date(dateInMilliSeconds);
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds() - date.getMilliseconds() % 100);
    return start.getTime();
}

export const getSubSecondEnd = (dateInMilliSeconds) => {
    return getSubSecondStart(dateInMilliSeconds) + 100 - 1;
}

export const nextSubSecond = () => {
    const startFn = (dateInMilliSeconds) => getSubSecondStart(dateInMilliSeconds) + 100;
    const endFn = (dateInMilliSeconds) => getSubSecondEnd(dateInMilliSeconds) + 100;
    return [startFn, endFn];
}

export const prevSubSecond = () => {
    const startFn = (dateInMilliSeconds) => getSubSecondStart(dateInMilliSeconds) - 100;
    const endFn = (dateInMilliSeconds) => getSubSecondEnd(dateInMilliSeconds) - 100;
    return [startFn, endFn];
}

export const getDateString = (dateInMilliSeconds) => {
    const fill = (n) => {
        if (n < 9) return `0${n}`;
        return `${n}`;
    }
    const date = new Date(dateInMilliSeconds);
    const yy = date.getFullYear()
    let mm = fill(date.getMonth() + 1);
    let dd = fill(date.getDate());
    let hh = fill(date.getHours());
    let mn = fill(date.getMinutes());
    let ss = fill(date.getSeconds());

    return `${mm}/${dd}/${yy} ${hh}:${mn}:${ss}`;
}
export const dataSetNames = {
    search: "search",
    resources: "resources",
    dasAlerts: "dasAlerts",
    pasAlerts: "pasAlerts",
}

export const dataSets = {
    search: { label: "Search", sourceType: dataSetNames.search, subType: "", iconName: "dataPoint", iconStyle: { width: "10px", height: "10px" }, eachFn: item => ({ time: item?.event?.occurrenceTimestamp }), objectMap: item => ({ eventId: item?.event?.eventId, dasDescriptor: item?.event?.dasDescriptor, descriptor: item?.event?.descriptor, sourceName: item?.security?.securityTag?.dataSourceName }) },
    resources: { label: "Resources", sourceType: dataSetNames.resources, subType: "resources", iconName: "resources", iconStyle: {}, eachFn: item => ({ time: item?.event?.occurrenceTimestamp }) },
    dasAlerts: { label: "Das Alerts", sourceType: dataSetNames.dasAlerts, subType: "dasAlerts", iconName: "alerts", iconStyle: {}, eachFn: item => ({ time: item?.eventDate }) },
    pasAlerts: { label: "Pas Alerts", sourceType: dataSetNames.pasAlerts, subType: "pasAlerts", iconName: "alerts", iconStyle: {}, eachFn: item => ({ time: item?.eventDate }) },
}

export const getAvailableDataSets = (sets, sourceType) => {
    return Object.keys(dataSets).map(key => {
        const ds = dataSets[key];
        const available = sets[key]?.length > 0;
        const label = `${ds.label}${ds.sourceType === "search" ? " (" + sourceType + ")" : ""}`
        return { ...ds, data: sets[key], key, available, label, subType: ds.sourceType === "search" ? sourceType : ds.sourceType };
    }).filter(ds => ds.available)
}

const sorter = (attr) => (a1, a2) => a1[attr] - a2[attr];

export const getClusterData = (items, dateAnchor, scale, timelineWidth) => {
    const sorted = [...items].sort(sorter("timeInMilliSeconds"));

    const positioned = sorted.map(item => {
        const position = getPosition(item.timeInMilliSeconds, dateAnchor, scale, timelineWidth);
        return { ...item, position };
    })

    const clustered = clusterData(positioned, ICON_WIDTH, CLUSTER_WIDTH);

    return clustered;
}

const clusterData = (positioned, iconWidth, clusterWidth) => {
    const clusters = [];
    if (positioned.length === 0) return clusters;
    let prevPosition = positioned[0].position;
    let currentCluster = [positioned[0]];
    let currentWidth = iconWidth;

    positioned.slice(1).map(item => {
        if (item.position <= prevPosition + currentWidth) {
            currentCluster.push(item);
            currentWidth = clusterWidth;
        }
        else {
            clusters.push(currentCluster);
            prevPosition = item.position
            currentCluster = [item];
            currentWidth = iconWidth;
        }
    })

    clusters.push(currentCluster);

    return clusters;
}

const minCellWidth = 40;
const maxCellWidth = 200;

const lblGetYear = (timeInMilliSeconds) => ({ title: new Date(timeInMilliSeconds).getFullYear(), subTitle: "" });
const lblGetBigMonth = (timeInMilliSeconds) => {
    const d = new Date(timeInMilliSeconds);
    return { title: months[d.getMonth()], subTitle: d.getFullYear() }
};
const lblGetMonth = (timeInMilliSeconds) => {
    const d = new Date(timeInMilliSeconds);
    return { title: fullMonth[d.getMonth()], subTitle: d.getFullYear() }
};
const lblGetWeek = (timeInMilliSeconds) => {
    const d = new Date(timeInMilliSeconds);
    return { title: months[d.getMonth()], subTitle: d.getDate() }; // this could be enhanced to show a month name only on the first cell that has that month name
};
const lblGetDay = (timeInMilliSeconds) => {
    const d = new Date(timeInMilliSeconds);
    return { title: d.getDate(), subTitle: weekDays[d.getDay()] };
};
const lblGetFullDay = (timeInMilliSeconds) => {
    const d = new Date(timeInMilliSeconds);
    return { title: fullWeekDays[d.getDay()], subTitle: d.getDate() };
};
const lblGetHour = (timeInMilliSeconds) => {
    const d = new Date(timeInMilliSeconds);
    let hours = d.getHours();
    let title, subTitle;
    if (hours === 0) {
        title = 12;
        subTitle = "AM"
    }
    else if (hours < 12) {
        title = hours;
        subTitle = "AM"
    }
    else if (hours === 12) {
        title = hours;
        subTitle = "PM"
    }
    else {
        title = hours % 12;
        subTitle = "PM"
    }
    return { title, subTitle };
};

const lblGetSubHour = (timeInMilliSeconds) => {
    const d = new Date(timeInMilliSeconds);
    let minutes = d.getMinutes();
    let h = lblGetHour(timeInMilliSeconds);
    let show = minutes % 30 === 0;
    return { title: show ? `${h.title} ${h.subTitle}` : "", subTitle: !show ? `${minutes - minutes % 5} m` : "" };
};

const lblGetMinute = (timeInMilliSeconds) => {
    const d = new Date(timeInMilliSeconds);
    let h = lblGetHour(timeInMilliSeconds);
    let m = d.getMinutes();
    let show = m % 10 === 0;
    return { title: show ? `${h.title} ${h.subTitle}` : "", subTitle: !show ? `${m} m` : "" };
};

const lblGetSubMinute = (timeInMilliSeconds) => {
    const d = new Date(timeInMilliSeconds);
    let seconds = d.getSeconds();
    let h = lblGetHour(timeInMilliSeconds);
    let m = d.getMinutes();
    let show = seconds % 15 === 0;
    return { title: show ? `${h.title} ${h.subTitle}` : "", subTitle: !show ? `${seconds - seconds % 5} s` : `${m} m` };
};

const lblGetSecond = (timeInMilliSeconds) => {
    const d = new Date(timeInMilliSeconds);
    let seconds = d.getSeconds();
    let h = lblGetHour(timeInMilliSeconds);
    let m = d.getMinutes();
    let show = seconds % 5 === 0;
    return { title: show ? `${h.title} ${h.subTitle}` : "", subTitle: !show ? `${seconds} s` : `${m} m` };
};

const lblGetSubSecond = (timeInMilliSeconds) => {
    const d = new Date(timeInMilliSeconds);
    let milliSeconds = d.getMilliseconds();
    return { title: `${milliSeconds - milliSeconds % 100} ms`, subTitle: "" };
};

export const calendar = {
    decade: { name: "decade", render: false, label: "DECADE", scaleZone: [MAX_SCALE / 3, 2 * MAX_SCALE], startFn: getDecadeStart, endFn: getDecadeEnd, nextFn: nextDecade, prevFn: prevDecade, labelFn: lblGetYear, lgFns: "year" },
    bigYear: { name: "bigYear", render: false, label: "B-YEAR", scaleZone: [MAX_SCALE / 5, MAX_SCALE / 3], startFn: getYearStart, endFn: getYearEnd, nextFn: nextYear, prevFn: prevYear, labelFn: lblGetBigMonth, lgFns: "month" },
    year: { name: "year", render: true, label: "YEAR", scaleZone: [120 * ONE_DAY, MAX_SCALE / 5], startFn: getYearStart, endFn: getYearEnd, nextFn: nextYear, prevFn: prevYear, labelFn: lblGetMonth, lgFns: "month" },
    bigMonth: { name: "bigMonth", render: false, label: "B-MONTH", scaleZone: [40 * ONE_DAY, 120 * ONE_DAY], startFn: getWeekStart, endFn: getWeekEnd, nextFn: nextWeek, prevFn: prevWeek, labelFn: lblGetWeek, lgFns: "week" },
    month: { name: "month", render: true, label: "MONTH", scaleZone: [10 * ONE_DAY, 40 * ONE_DAY], startFn: getMonthStart, endFn: getMonthEnd, nextFn: nextMonth, prevFn: prevMonth, labelFn: lblGetDay, lgFns: "day" },
    week: { name: "week", render: true, label: "WEEK", scaleZone: [2 * ONE_DAY, 10 * ONE_DAY], startFn: getWeekStart, endFn: getWeekEnd, nextFn: nextWeek, prevFn: prevWeek, labelFn: lblGetFullDay, lgFns: "day" },
    day: { name: "day", render: true, label: "DAY", scaleZone: [3 * ONE_HOUR, 2 * ONE_DAY], startFn: getDayStart, endFn: getDayEnd, nextFn: nextDay, prevFn: prevDay, labelFn: lblGetHour, lgFns: "hour" },
    hour: { name: "hour", render: false, label: "HOUR", scaleZone: [20 * ONE_MINUTE, 3 * ONE_HOUR], startFn: getHourStart, endFn: getHourEnd, nextFn: nextHour, prevFn: prevHour, labelFn: lblGetSubHour, lgFns: "minutes5" },
    minutes5: { name: "minutes5", render: false, label: "5 MINUTE", scaleZone: [3 * ONE_MINUTE, 20 * ONE_MINUTE], startFn: getMinutes5Start, endFn: getMinutes5End, nextFn: nextMinutes5, prevFn: prevMinutes5, labelFn: lblGetMinute, lgFns: "minute" },
    minute: { name: "minute", render: false, label: "MINUTE", scaleZone: [20 * ONE_SECOND, 3 * ONE_MINUTE], startFn: getMinuteStart, endFn: getMinuteEnd, nextFn: nextMinute, prevFn: prevMinute, labelFn: lblGetSubMinute, lgFns: "seconds5" },
    seconds5: { name: "seconds5", render: false, label: "5 SECONDSE", scaleZone: [3 * ONE_SECOND, 20 * ONE_SECOND], startFn: getSeconds5Start, endFn: getSeconds5End, nextFn: nextSeconds5, prevFn: prevSeconds5, labelFn: lblGetSecond, lgFns: "second" },
    second: { name: "second", render: false, label: "SECOND", scaleZone: [ONE_SECOND / 10, 3 * ONE_SECOND], startFn: getSecondStart, endFn: getSecondEnd, nextFn: nextSecond, prevFn: prevSecond, labelFn: lblGetSubSecond, lgFns: "millisecond100" },
    millisecond100: { name: "millisecond100", render: false, label: "MILLISECOND100", scaleZone: [10, 0], startFn: getSubSecondStart, endFn: getSubSecondEnd, nextFn: nextSubSecond, prevFn: prevSubSecond, labelFn: () => "", lgFns: "" },
}

export const getCalMode = (scale) => {
    return Object.keys(calendar).find(key => {
        const cal = calendar[key];
        return scale > cal.scaleZone[0] && scale <= cal.scaleZone[1];
    })
}

export const generateLabels = (dateAnchor, scale, timelineWidth, calendarMode) => {
    let calMode = calendarMode;

    if (!calMode) {
        calMode = getCalMode(scale);
    }
    const labels = [];
    let unitWidth = 0, unitOffset = 0, count = 1, lastAnchor = 0;

    if (!calMode) return { labels, unitWidth, unitOffset };

    const cal = calendar[calMode];
    const lblFn = cal.labelFn;

    const lgFns = calendar[cal.lgFns];
    const [nextStart, _] = lgFns.nextFn();

    let anchor = lgFns.startFn(dateAnchor);
    unitOffset = getPositionDelta(anchor - dateAnchor, scale, timelineWidth);

    while (anchor < dateAnchor + scale) {
        labels.push(lblFn(anchor))
        lastAnchor = nextStart(anchor);
        unitWidth += getPositionDelta(lastAnchor - anchor, scale, timelineWidth);
        count++;
        anchor = lastAnchor;
    }

    lastAnchor = nextStart(anchor);
    unitWidth += getPositionDelta(lastAnchor - anchor, scale, timelineWidth);
    unitWidth = unitWidth / count;
    return { labels, unitWidth, unitOffset };
}

export const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const fullWeekDays = ["Sunday", "Monday", "Tuesday", "Wed", "Thursday", "Friday", "Saturday"];
export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const fullMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const calcLength = (date, level) => {

}

export const getYear = (dateInMilliSeconds) => {
    const d = new Date(dateInMilliSeconds);
    return d.getFullYear();
}

export const getYearMonth = (dateInMilliSeconds) => {
    const d = new Date(dateInMilliSeconds);
    const year = d.getFullYear();
    const month = fullMonth[d.getMonth()];

    return `${month} ${year}`;
}

export const getYearMonthDay = (dateInMilliSeconds) => {
    const d = new Date(dateInMilliSeconds);
    const year = d.getFullYear();
    const month = months[d.getMonth()];
    const date = d.getDate();

    return `${month} ${date} ${year}`;
}

export const getDateNavString = (dateInMilliSeconds) => {
    const d = new Date(dateInMilliSeconds);

    const day = weekDays[d.getDay()];
    const month = months[d.getMonth()];
    const date = d.getDate();
    const year = d.getFullYear();

    return `${day} ${month} ${date} ${year}`;
}

export const getPlainDate = (dateInMilliSeconds) => {
    const d = new Date(dateInMilliSeconds);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}
