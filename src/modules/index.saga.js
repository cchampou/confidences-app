import { all } from 'redux-saga/effects';
import homeSaga from './home/home.saga';
import hivesSaga from './adminManageHives/hives.saga';


export default function* rootSaga() {
  yield all([
    homeSaga(),
    hivesSaga(),
  ]);
}
