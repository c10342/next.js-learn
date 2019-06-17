
import {LOGOUT} from '../type/user'

const initialState = {}

function userReducer(state = initialState,action){
    switch(action.type){
        case LOGOUT:
        return {}
        default:
        return state
    }
}

export default userReducer