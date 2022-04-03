import React, { useState, useCallback, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardActionArea, CardContent } from '@material-ui/core';
import Icons, { Icon } from '../ /../../utils/Icons';

const useStyles = makeStyles((theme) => {
    return {

        cardRoot: {
            '& .MuiPaper-outlined': {
                border: "unset",
            },
            "&:last-child": {
                marginBottom: "0px"
            },
            '& .MuiPaper-rounded': {
                borderRadius: "0px"
            },
        },
        content: {
            display: "grid",
            alignItems: "center",
            gridTemplateAreas: `"_ icon label bin"`,
            gridTemplateColumns: "0px 2fr 8fr auto",
            columnGap: "10px",
            height: "50px",
            padding: "0",
        },
        contentNoBin: {
            display: "grid",
            alignItems: "center",
            gridTemplateAreas: `"_ icon label"`,
            gridTemplateColumns: "0px 2fr 8fr",
            columnGap: "10px",
            height: "50px",
            padding: "0",
        },
        icon: {
            gridArea: "icon",
            borderRadius: "50%",
            color: "blue",
            width: 32,
            height: 32,
            boxShadow: "0px 0px 5px 0px rgb(68 68 68 / 15%)",
            backgroundColor: "#FFFFFF",
        },
        label: {
            gridArea: "label",
            fontSize: "0.75rem",
            fontWeight: "400",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
        bin: {
            gridArea: "bin",
        },
        centerImg: {
            display: "grid",
            alignContent: "center",
            justifyContent: "center",
        },
    }
});

const SelectorCard = React.forwardRef(({ name, label, iconName, iconStyle, onClick, removable, onRemove, isSelector = false, disabled = false }, ref) => {
    const classes = useStyles();
    const [bin, setBin] = useState("");
    const onBin = useRef(false);

    const onCardHover = useCallback(() => {
        if (!onBin.current) setBin(Icons.bin.name);
    });

    const onCardLeave = useCallback(() => {
        setBin("");
    });

    const onBinHover = useCallback(() => {
        onBin.current = true;
        setBin(Icons.binHover.name);
    });

    const onBinLeave = useCallback(() => {
        onBin.current = false;
        setBin(Icons.bin.name);
    })

    const removeCard = useCallback((e) => {
        onRemove(name);
        e.stopPropagation();
    });

    const onClickCard = (e) => {
        if (isSelector) {
            onClick(e);
        }
        else {
            onClick(name);
        }
    }

    const LI = Icon(iconName) || Icons.fpo.icon;
    const cardIcon = iconName ? <div className={`${classes.icon} ${classes.centerImg}`} ><LI style={iconStyle} /></div> : null

    const BI = Icon(bin);
    const binIcon = bin ? <BI onMouseOver={onBinHover} onMouseLeave={onBinLeave} onClick={removeCard} className={`${classes.bin} ${classes.centerImg}`} /> : null

    return (
        <div className={classes.cardRoot} onMouseOver={onCardHover} onMouseLeave={onCardLeave} >
            <Card variant="outlined">
                <CardActionArea disabled={disabled}>
                    <CardContent onClick={onClickCard} className={removable ? classes.content : classes.contentNoBin}>
                        {cardIcon}
                        <Typography className={classes.label}>{label}</Typography>
                        {removable && binIcon}
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
})


export default SelectorCard;
