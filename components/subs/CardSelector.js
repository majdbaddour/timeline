import React from 'react';
import Menu from "@material-ui/core/Menu";
import { usePopup } from '../../hooks';
import { SelectorCard } from './';

const CardSelector = (props) => {
    const { label, name, value, data, onChange, onRemove, removable, disabled = false, ...menuProps } = props;
    const [show, setShow, onShow, coordinates, anchorElement, setAnchorElement] = usePopup();

    const onClose = () => {
        setShow(false);
    }

    const onSelect = (key) => {
        onChange({ name: value, value: key });
        setShow(false);
    }

    const divClick = (e) => {
        onShow(e);
    }

    const selectedItem = data.find(item => item.key === value);

    return <div >
        <SelectorCard onClick={divClick} label={value ? selectedItem.value : label} iconName={value ? selectedItem.iconName : ""} iconStyle={value ? selectedItem.iconStyle : {}}
            removable={removable} name={name} onRemove={onRemove} isSelector={true} disabled={disabled}
        />
        {show && data.length > 0 &&
            <Menu
                anchorEl={anchorElement}
                elevation={2}
                open={show}
                onClose={onClose}
                {...menuProps}
            >
                {data.map((item, idx) => {
                    return <SelectorCard key={`${item.key}-${idx}`} onClick={onSelect}
                        removable={false} onRemove={onRemove} iconName={item.iconName} iconStyle={item.iconStyle}
                        label={item.value} name={item.key}
                    />
                })}
            </Menu>
        }
    </div>
}

export default CardSelector;
