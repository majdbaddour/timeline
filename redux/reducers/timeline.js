// ACTION TYPES //
export const types = {
    TIMELINE_TOGGLE: "TIMELINE_TOGGLE",
    TIMELINE_SET_DATE_ANCHOR: "TIMELINE_SET_DATE_ANCHOR",
    TIMELINE_SET_ANCHOR_SCALE_SLIDER: "TIMELINE_SET_ANCHOR_SCALE_SLIDER",

    TIMELINE_SELECT_DATA_SET: "TIMELINE_SELECT_DATA_SET",
    TIMELINE_DATA_SET_AVAILABLE: "TIMELINE_DATA_SET_AVAILABLE",
    
    TIMELINE_SELECT_POINT: "TIMELINE_SELECT_POINT",
};

// REDUCERS //
export const initialState = {
    isOpen: false,
    scale: 1000, // initial scale value 1 second
    slider: 0, // initial slider value for 1 second scale 
    dateAnchor: 0, // this state is always updated to reflect the time value of the leftmost point in timeline viewport: t1 (see timeline's config.js file)
    zoomingFactor: 1.25, // one tick of the mouse wheel generates Math.sign(e.deltaY) = +/- 1 => scaling Factor = 1.25 / 0.8, .i.e: 5/4 or 4/5
    calendarMode: "",

    selectedSets: [],
    availableSets: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.TIMELINE_TOGGLE:
            return {
                ...state,
                isOpen: !state.isOpen,
            };
        case types.TIMELINE_SET_DATE_ANCHOR:
            return {
                ...state,
                dateAnchor: action.payload.dateTimeInMilliSeconds,
                calendarMode: action.payload.calendarMode ?? "",
            };
        case types.TIMELINE_SET_ANCHOR_SCALE_SLIDER:
            return {
                ...state,
                dateAnchor: action.payload.dateAnchor,
                scale: action.payload.scale,
                slider: action.payload.slider,
                calendarMode: action.payload.calendarMode,
            };
        case types.TIMELINE_SELECT_DATA_SET:
            if (action.payload.selected) {
                return {
                    ...state,
                    selectedSets: [...state.selectedSets, action.payload.dataSetName],
                };
            }
            else {
                return {
                    ...state,
                    selectedSets: state.selectedSets.filter(item => item !== action.payload.dataSetName),
                };
            }
        case types.TIMELINE_DATA_SET_AVAILABLE:
            const { available, dataSetName } = action.payload;

            if (available) {
                if (!state.availableSets.includes(dataSetName)) {
                    return {
                        ...state,
                        availableSets: [...state.availableSets, dataSetName],
                    };
                }
                else {
                    return state;
                }
            }
            else {
                if (state.availableSets.includes(dataSetName)) {
                    return {
                        ...state,
                        availableSets: state.availableSets.filter(name => name !== dataSetName),
                    };
                }
                else {
                    return state;
                }
            }
        default:
            return state;
    }
};

export const toggleTimeline = () => ({ type: types.TIMELINE_TOGGLE });
export const setDateAnchor = (dateTimeInMilliSeconds, calendarMode) => ({ type: types.TIMELINE_SET_DATE_ANCHOR, payload: { dateTimeInMilliSeconds, calendarMode } });
export const setAnchorScaleSlider = (dateAnchor, scale, slider, calendarMode) => ({ type: types.TIMELINE_SET_ANCHOR_SCALE_SLIDER, payload: { dateAnchor, scale, slider, calendarMode } });

export const selectDataSet = (dataSetName, selected, index) => ({ type: types.TIMELINE_SELECT_DATA_SET, payload: { dataSetName, selected, index } });
export const selectPoint = (cluster, sourceType, subType) => ({ type: types.TIMELINE_SELECT_POINT, payload: { cluster, sourceType, subType } });

