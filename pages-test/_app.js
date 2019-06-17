import App,{Container} from 'next/app'
import {Provider} from 'react-redux'
import MyContext from '../lib/my-context'
import testHoc from '../lib/with-redux'

class MyApp extends App{
    state = {
        name:'张三'
    }

    static async getInitialProps(ctx){
        const {Component} = ctx
        let pageProps = {}
        if(Component.getInitialProps){
            pageProps = await Component.getInitialProps()
        }
        return {
            pageProps
        }
    }

    render(){
        const {Component,pageProps,reduxStore} = this.props
        return (
            <Container>
                <Provider store={reduxStore}>
                    <MyContext.Provider value={this.state.name}>
                        <Component {...pageProps} />
                    </MyContext.Provider>
                </Provider>
            </Container>
        )
    }
}

export default testHoc(MyApp)