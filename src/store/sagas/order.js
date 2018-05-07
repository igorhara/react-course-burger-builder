import axios from "../../axios-orders";
import {put} from "redux-saga/effects";
import * as actions from "../actions/";


export function* purchaseBurgerSaga(action){
    yield put(actions.purchaseBurgerStart());
    try{
        const response = yield axios.post('/orders.json?auth='+action.token,action.orderData);
        yield put(actions.purchaseBurgerSuccess(response.data.name,action.orderData));
    }catch(error){
        yield put(actions.purchaseBurgerFail(error));
    }

}


export function* fetchOrdersSaga(action){
    yield put(actions.fetchOrdersStart());
    //axios.get('/orders.json?auth='+state.auth.token)
    const queryParams = '?auth='+action.token+'&orderBy="userId"&equalTo="'+action.userId+'"';
    try{
        const response = yield axios.get('/orders.json'+queryParams);
        const fetchedData = [];
        for(let key in response.data){
            fetchedData.push({...response.data[key], id:key});
        }
        yield put(actions.fetchOrdersSuccess(fetchedData));
    }catch(error){
        yield put(actions.fetchIngredientsFailed(error));
    }
}