import App,{Container} from 'next/app'
import {Provider} from 'react-redux'
import testHoc from '../lib/with-redux'
import Layout from '../components/Layout'
import 'antd/dist/antd.css'
import PageLoading from '../components/PageLoading'
import Router from 'next/router'
import Link from 'next/link'


class MyApp extends App{
    state = {
        loading:false
    }

    static async getInitialProps(ctx){
        const {Component} = ctx
        let pageProps = {}
        if(Component.getInitialProps){
            pageProps = await Component.getInitialProps(ctx)
        }
        return {
            pageProps
        }
    }

    startLoading=()=>{
        this.toggleLoading(true)
    }

    stopLoading=()=>{
        this.toggleLoading(false)
    }

    toggleLoading(flag){
        this.setState({
            loading:flag
        })
    }

    componentDidMount(){
        Router.events.on('routeChangeStart',this.startLoading)
        Router.events.on('routeChangeComplete',this.stopLoading)
        Router.events.on('routeChangeError',this.stopLoading)
    }

    componentWillUnmount(){
        Router.events.off('routeChangeStart',this.startLoading)
        Router.events.off('routeChangeComplete',this.stopLoading)
        Router.events.off('routeChangeError',this.stopLoading)
    }

    render(){
        const {Component,pageProps,reduxStore} = this.props
        const {loading} = this.state
        return (
            <Container>
                <Provider store={reduxStore}>
                    <Layout>
                        {loading?<PageLoading />:null}
                        <Component {...pageProps} />
                    </Layout>
                </Provider>
            </Container>
        )
    }
}

export default testHoc(MyApp)