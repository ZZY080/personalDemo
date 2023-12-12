import {createStore,applyMiddleware}  from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import counterReducer from "./reducers";
// 引入redux-thunk,用于异步action
import thunk from "redux-thunk";


const middleware = []; // You can add middleware here if needed
const enhancer = composeWithDevTools(
    applyMiddleware(...middleware,thunk)
)
const store = createStore(
    counterReducer,
    enhancer,
    );

export default store;