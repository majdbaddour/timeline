

import React, { useRef, useState, useContext, useCallback, useMemo } from 'react';
import { TimelineContext } from "../TimelineContainer";
import { makeStyles } from '@material-ui/core'
import { ChevronRight, ChevronLeft } from "@material-ui/icons";
import * as config from '../config';

const useStyles = makeStyles(theme => {
    return {
        root: {
            height: "20px",
        },
        dateNav: {
            display: "flex",
            justifyContent: "center",
            paddingTop: "5px",
        },
        date: {
            alignSelf: "center",
            fontSize: "0.85rem",
            fontWeight: 500,
        },
        nav: {
            cursor: "pointer",
        }
    }
})

const DateNav = ({ className }) => {
    const classes = useStyles()
    const { dateAnchor, calendarMode, scale, setLevel } = useContext(TimelineContext);

    const moveNext = useCallback((forward) => {
        let calMode = calendarMode;

        if (!calMode) {
            calMode = config.getCalMode(scale);
        }

        if (calMode) {
            const level = config.calendar[calMode];
            const [startFn, endFn] = forward ? level.nextFn() : level.prevFn();

            return setLevel(startFn, endFn, level.name, dateAnchor);
        }
    }, [dateAnchor, calendarMode, scale])

    const formattedDate = useMemo(() => {
        switch (calendarMode) {
            case config.calendar.year.name:
                return config.getYear(dateAnchor);
                break;
            case config.calendar.month.name:
                return config.getYearMonth(dateAnchor);
                break;
            case config.calendar.week.name:
                return config.getYearMonthDay(dateAnchor);
                break;
            case config.calendar.day.name:
                return config.getDateNavString(dateAnchor);
                break;
            default:
                return config.getPlainDate(dateAnchor);
        }
    }, [dateAnchor, calendarMode])

    return (
        <div className={className}>
            {dateAnchor && <div className={classes.root}>
                <div className={classes.dateNav}>
                    <ChevronLeft onClick={() => moveNext(false)} className={classes.nav} />
                    <div className={classes.date}>{formattedDate}</div>
                    <ChevronRight onClick={() => moveNext(true)} className={classes.nav} />
                </div>
            </div>}
        </div>
    )
}

export default DateNav;
