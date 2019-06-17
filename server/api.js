
const {serverRequest} = require('../lib/api')

module.exports = (server) => {
    server.use(async (ctx,next)=>{
        const path = ctx.path
        if(path.startsWith('/github/')){
            let headers = {}
            const session = ctx.session
            if(session && session.githubAuth){
                headers['Authorization'] = `${session.githubAuth.token_type} ${session.githubAuth.access_token}`
            }
            try {
                const method = ctx.method
                const url = ctx.url.replace('/github/','/')
                const result = await serverRequest({
                    method,
                    url,
                    headers,
                    data:ctx.request.body || {}
                })
                ctx.set('Content-Type','application/json')
                if(result.status === 200){
                    ctx.body = result.data
                }else{
                    ctx.body ={
                        success:false
                    }
                }
            } catch (error) {
                console.log(error)
                ctx.set('Content-Type','application/json')
                ctx.body ={
                    success:false
                }
            }
        }else{
            await next()
        }
    })
}