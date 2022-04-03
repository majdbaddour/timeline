

import React, { useContext, useMemo } from 'react';
import { TimelineContext } from "../TimelineContainer";
import { makeStyles } from '@material-ui/core'
import * as config from '../config';

const useStyles = makeStyles(theme => {
    return {
        labelsContainer: {
            height: "35px",
            display: "grid",
            position: "absolute"
        },
        twoCell: {
            display: "grid",
            gridTemplateRows: "1fr 1fr",
            rowGap: "2px",
            alignItems: "center",
            justifyItems: "center",
            '& .title': {
                fontSize: "0.6rem",
                fontWeight: 500,
                alignSelf: "end"
            },
            '& .subTitle': {
                fontSize: "0.5rem",
                alignSelf: "start"
            }
        },
        cell: {
            display: "grid",
            gridTemplateRows: "1fr",
            alignItems: "center",
            justifyItems: "center",
            '& .title': {
                fontSize: "0.6rem",
                fontWeight: 500,
            },
        },
    }
})

const Labels = ({ className, style }) => {
    const classes = useStyles()
    const { timelineWidth, labels, unitWidth, unitOffset } = useContext(TimelineContext);

    const containerStyle = useMemo(() => {
        return {
            gridTemplateColumns: `repeat(${labels.length}, ${unitWidth}px)`,
            left: `${timelineWidth * config.twMultiplier + unitOffset}px`,
            transition: "all 0ms",
        }
    }, [timelineWidth, unitWidth, labels, unitOffset])

    return (
        <div name="dateLabel" className={className} style={style} >
            <div className={`${classes.labelsContainer} noWheel`} style={containerStyle} >
                {labels.map((label, idx) => {
                    return <div key={idx} className={`${label.subTitle === "" ? classes.cell : classes.twoCell} noWheel`}>
                        <div className="title noWheel">{label.title}</div>
                        {label.subTitle !== "" && <div className="subTitle noWheel">{label.subTitle}</div>}
                    </div>
                })}
            </div>
        </div>
    )
}

export default Labels;