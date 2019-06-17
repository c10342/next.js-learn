import React from 'react'

import createStore from '../store/index'

// 判断是否是服务器环境
const isServer = typeof window === 'undefined'  

const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

// 初始化store
function initialStore(initialState){
    if(isServer){
        return createStore(initialState)
    }

    if(!window[__NEXT_REDUX_STORE__]){
        window[__NEXT_REDUX_STORE__] = createStore(initialState)
    }

    return window[__NEXT_REDUX_STORE__]
}

// 使用高阶组件传递store
export default Comp => {
    class WithReduxApp extends React.Component{
        constructor(props){
            super(props)

            this.reduxStore = initialStore(props.initialReduxStore)
        }

        render(){
            const {Component,pageProps,...rest} = this.props

            if(pageProps){
                pageProps.test = '123'
            }

            return (
                <Comp
                Component = {Component}
                pageProps = {pageProps}
                {...rest}
                reduxStore = {this.reduxStore}
                 />
            )
        }
    }

    WithReduxApp.getInitialProps = async (ctx) => {

        // 同步store
        let reduxStore = {}
        if(isServer){
            const {req} = ctx.ctx
            const {session} = req
            if(session && session.userInfo){
                reduxStore = initialStore({
                    user:session.userInfo
                })
            }else{
                reduxStore = initialStore()
            }
        }else{
            reduxStore = initialStore()
        }

        ctx.reduxStore = reduxStore

        let appProps = {}

        if(typeof Comp.getInitialProps == 'function'){
            appProps = await Comp.getInitialProps(ctx)
        }
        return {
            ...appProps,
            initialReduxStore:reduxStore.getState()
        }
    }
    return WithReduxApp
}

