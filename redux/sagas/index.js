
/**
 * Combine your Sagas into one output
 */

import { all, fork } from 'redux-saga/effects';
import * as mapSagas from './_map';
import * as configSagas from './_config';
import * as authSagas from './_auth';
import * as searchSagas from './_search';
import * as geoSagas from './_searchpoints';
import * as routeSagas from './_route';
import * as loggingSagas from './_logging';
import * as userSagas from './_userpref';
import * as offLyrsSagas from './_officiallayers';
import * as reports from './_reports';
import * as cameras from './_cameras';
import * as notificationHub from './_notificationHub';
import * as correlation from './_correlation';
import * as alerts from './_alerts';
import * as jobs from './_jobs';
import * as timeline from './_timeline';

export default function* rootSaga() {
    yield all([
    ...Object.values(mapSagas),
    ...Object.values(configSagas),
    ...Object.values(authSagas),
    ...Object.values(searchSagas),
    ...Object.values(geoSagas),
    ...Object.values(routeSagas),
    ...Object.values(loggingSagas),
    ...Object.values(userSagas),
    ...Object.values(offLyrsSagas),
    ...Object.values(reports),
    ...Object.values(cameras),
    ...Object.values(notificationHub),
    ...Object.values(correlation),
    ...Object.values(alerts),
    ...Object.values(jobs),
    ...Object.values(timeline),
    // more sagas from different files
  ].map(fork));
}
