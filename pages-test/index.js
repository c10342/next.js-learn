import React from 'react'
import {connect} from 'react-redux'
import getConfig from 'next/config' 
import axios from 'axios'

const {publicRuntimeConfig} = getConfig()

function getUserInfo(){
    axios.get('/api/user/info').then(res=>{
        console.log(res)
    })
}

const Index = ({test,user}) => {
    return (<div>
        {test}-----{user.username}
        <a href={publicRuntimeConfig.OAUTH_URL}>去登陆</a>

        <button onClick={()=>{getUserInfo()}}>getUserInfo</button>
    </div>)
}

const mapStateToProps = (state) => {
    return {
        user:state.user
    }
}

export default connect(mapStateToProps,null)(Index)