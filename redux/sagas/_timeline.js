import { takeLatest, call, put, select } from "redux-saga/effects";
import { types as timelineTypes } from "../reducers/timeline";
import { types as searchTypes } from "../reducers/search";
import { types as routeTypes } from "../reducers/route";
import * as config from '../../components/bottomContainer/timeline/config';

// selectors
const stateSelector = state => state;

// WATCHERS //
export function* watchRoute() {
    yield takeLatest(timelineTypes.TIMELINE_SELECT_POINT, selectPoint);
}

// WORKER //
function* selectPoint(action) {
    const { cluster, sourceType, subType } = action.payload;

    try {
        if (sourceType === config.dataSetNames.search) {
            const filter = cluster.map(config.dataSets[sourceType].objectMap);
    
            yield put({
                type: routeTypes.INJECT_ROUTE,
                payload: { routeInfo: { route: sourceType, type: subType, query: "", showSearchResults: true } }
            });
            
            if (filter.length == 1) {
                yield put({
                    type: searchTypes.REMOVE_SEARCH_RESULTS_FILTER,
                });
                yield put({
                    type: searchTypes.SEARCH_RESULT_CARD_SELECTED,
                    payload: { ...filter[0] }
                });
            }
            else if (filter.length > 1) {
                yield put({
                    type: searchTypes.SEARCH_RESULT_CARD_UNSELECTED,
                });
                yield put({
                    type: searchTypes.FILTER_SEARCH_RESULTS,
                    payload: { filter }
                });
            }
        }
    } catch (error) {
        console.log("Error in saga selectPoint: ", error);
    }
}



