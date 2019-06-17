import React from 'react'
const {request} = require('../lib/api')


const Index = ({userRepos,userStaredRepos,isLogin}) => {
    console.log(userRepos.length)
    console.log(userStaredRepos.length)
    console.log(isLogin)
    return (<div>
        Index
    </div>)
}

Index.getInitialProps = async ({reduxStore,ctx})=>{
    try {
       const {req,res} = ctx
       const user = reduxStore.getState().user
       if(!user || !user.id){
           return {isLogin:false}
       }

       const userRepos = await request({url:'/github/user/repos',req,res})
       const userStaredRepos = await request({url:'/github/user/starred',req,res})
       return {
        userRepos:userRepos.data,
        userStaredRepos:userStaredRepos.data,
        isLogin:true
       }
    } catch (error) {
        console.log('Index.getInitialProps  error')
        console.log(error)
    }
}


export default Index