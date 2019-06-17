import Document,{Html,Head,Main,NextScript} from 'next/document'

// 高阶组件
function WithLog(Comp){
    return props => {
        console.log('WithLog')
        return <Comp {...props} />
    }
}

class MyDocument extends Document{
    static async getInitialProps(ctx){
        let props = {}
        if(Document.getInitialProps){
            props = await Document.getInitialProps(ctx)
        }
        return {
            ...props
        }
    }

    render(){
        return (
            <Html>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default WithLog(MyDocument)