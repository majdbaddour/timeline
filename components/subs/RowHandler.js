import React, { useContext, useMemo } from 'react';
import { TimelineContext } from "../TimelineContainer";
import { DataPoint } from './';
import * as config from '../config';

const RowHandler = ({ row, rowIndex }) => {
    const { dateAnchor, scale, timelineWidth, unitWidth, labels, unitOffset, onPointClick } = useContext(TimelineContext);

    const indexed = useMemo(() => {
        return row.data.map((item, origIndex) => {
            let time = row.eachFn(item)?.time;
            if (time) {
                if (/Z$/.test(time)) time = time.slice(0, -1);
                time = new Date(time).getTime();
            }
            return { ...item, origIndex, timeInMilliSeconds: time }
        });
    }, [row])

    const filtered = useMemo(() => {
        return indexed.filter(item => {
            if (!item.timeInMilliSeconds) return false;
            return item.timeInMilliSeconds >= dateAnchor && item.timeInMilliSeconds <= dateAnchor + scale;
        })
    }, [indexed, dateAnchor, scale])

    const clustered = useMemo(() => {
        return config.getClusterData(filtered, dateAnchor, scale, timelineWidth);
    }, [filtered, dateAnchor, scale, timelineWidth])

    return (
        <>
            {clustered.map((cluster, index) => {
                return <DataPoint key={`${cluster[0].timeInMilliSeconds}`} cluster={cluster} eachFn={row.eachFn} index={index} onPointClick={(cluster) => onPointClick(cluster, rowIndex)} />
            })}
        </>
    )
}

export default RowHandler;
