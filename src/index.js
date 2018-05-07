import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import bbReducer from "./store/reducers/burgerBuilder";
import {createStore, applyMiddleware, compose,combineReducers} from "redux";
import thunk from 'redux-thunk';
import orderReducer from './store/reducers/order';
import authReducer from './store/reducers/auth';
import createSagaMiddleware from 'redux-saga';
import {watchAuth, watchBurgerBuilder, watchOrder} from "./store/sagas/index";

const rootReducer =combineReducers({
    burgerBuilder:bbReducer,
    order:orderReducer,
    auth:authReducer
});

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = process.env.NODE_ENV==='development'?window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__:null || compose;
const store = createStore(rootReducer,
    composeEnhancers(
    applyMiddleware(thunk,sagaMiddleware)
));

sagaMiddleware.run(watchAuth);
sagaMiddleware.run(watchBurgerBuilder);
sagaMiddleware.run(watchOrder);

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
