import {createStore,combineReducers,applyMiddleware} from 'redux'

import thunk from 'redux-thunk'

import {composeWithDevTools} from 'redux-devtools-extension'

import userReducer from './reducer/user'

const reducers = combineReducers({
    user:userReducer
})


export default function initialStore(state={}){
    const store = createStore(
        reducers,
        state,
        composeWithDevTools(applyMiddleware(thunk))
    )
    return store
}