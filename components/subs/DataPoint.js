import React from 'react';
import { makeStyles } from '@material-ui/core'
import * as config from '../config';
import { Icon } from '../../../../utils/Icons';

const useStyles = makeStyles(theme => {
    return {
        point: {
            position: "absolute",
            backgroundColor: "#FFF",
            cursor: "pointer",
            zIndex: 100,
            borderRadius: "50%",
            textAlign: "center",
            fontSize: "0.8rem",
            verticalAlign: "middle", 
            fontWeight: 600,
            color: "#003ECC",
            boxShadow: "-1px 3px 5px 0px rgb(68,68,68,0.15)",
            transition: "all 0ms"

        },
        icon: {
            fill: "#003ecc",
            cursor: "pointer",
            zIndex: 100,
        }
    }
})

const getProps = (cluster) => {
    const length = cluster.length
    const iconWidth = length === 1 ? config.ICON_WIDTH : config.CLUSTER_WIDTH;
    const lineHeight = length === 1 ? config.ICON_WIDTH : config.CLUSTER_WIDTH;
    const divTop = length === 1 ? 20 : 12;
    const position = length === 1 ? cluster[0].position : (cluster[length - 1].position + cluster[0].position) / 2;
    const positionLeft = position - iconWidth / 2;
    const date = config.getDateString(cluster[0].timeInMilliSeconds);
    const dateN = config.getDateString(cluster[length - 1].timeInMilliSeconds);
    const title = date === dateN ? date : `${date} - ${dateN}`;

    return { length, iconWidth, lineHeight, divTop, position, positionLeft, title };
}

const DataPoint = ({ cluster, eachFn, index, onPointClick }) => {
    const classes = useStyles()
    const { length, iconWidth, lineHeight, divTop, position, positionLeft, title } = getProps(cluster);
    const DataPointIcon = Icon("dataPoint");
    
    const onClick = () => {
        console.log(length === 1 ? `item at index ${cluster[0].origIndex} clicked` : `cluster with ${length} items clicked, indices: ${cluster.map(item => item.origIndex).join(", ")}`);
        onPointClick(cluster);
    }

    return <div className={`${classes.point} noWheel`} onClick={onClick}
        style={{ left: positionLeft, height: iconWidth, width: iconWidth, top: `${divTop}px`, lineHeight: `${lineHeight}px` }}
        title={title}
    >
        {length > 1 && length}
        {length === 1 && <DataPointIcon onClick={onClick} className={`${classes.icon} noWheel`} />}
    </div>
}

export default DataPoint;