import {LOGOUT} from '../type/user'
import axios from 'axios'


export function logout(){
    return dispatch => {
        axios.post('/logout').then(res=>{
            if(res.status ===200){
                dispatch({
                    type:LOGOUT,
                })
            }else{
                console.log('logout fail',res)
            }
        }).catch(error=>{
            console.log('logout fail',error)
        })
    }
}