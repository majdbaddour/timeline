

import React, { useContext } from 'react';
import { TimelineContext } from "../TimelineContainer";
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core'
import { CardSelector } from "../../../ui";
import * as config from '../config';

const useStyles = makeStyles(theme => {
    return {
        row: {
            height: "50px",
            borderBottom: "1px solid #CCC",
        }
    }
})

const DatasetSelector = ({ rows, availableSets, className }) => {
    const classes = useStyles()
    const { selectedSets, selectSet } = useContext(TimelineContext);

    const data = availableSets.map(ads => {
        return { key: ads.key, value: ads.label, iconName: ads.iconName, iconStyle: ads.iconStyle };
    })

    const filteredData = data.filter(item => !selectedSets.includes(item.key));

    const onRemove = (name, idx) => {
        selectSet(name, false);
    }

    const onChange = ({ name, value, idx }) => {
        selectSet(name, false);
        selectSet(value, true, idx);
    }

    const onSet = ({ value }) => {
        selectSet(value, true);
    }

    return (
        <div className={className}>
            {rows.map((row, idx) => {
                return <div key={idx + 1} className={classes.row}>
                    <CardSelector className="dropdown" name={row.key} value={row.key} data={data} onChange={({ name, value }) => onChange({ name, value, idx })} onRemove={(name) => onRemove(name, idx)} removable={true}
                        anchorOrigin={{ vertical: "top", horizontal: "left" }}
                        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
                    />
                </div>
            })}
            <div key={0} className={classes.row}>
                <CardSelector className="dropdown" label={data.length > 0 ? "Select Dataset" : "No Data Sets"}
                    disabled={filteredData.length === 0}
                    data={filteredData} onChange={onSet}
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    transformOrigin={{ vertical: "bottom", horizontal: "left" }} 
                />

            </div>
        </div>
    )
}

export default DatasetSelector;
