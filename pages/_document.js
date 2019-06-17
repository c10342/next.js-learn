import Document,{Html,Head,Main,NextScript} from 'next/document'


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

export default MyDocument