const axios = require('axios')
const config = require('../config')
const { client_id, client_secret, request_token_url,request_userInfo_url } = config.github

// 获取githu用户信息
module.exports = (server) => {
    server.use(async (ctx,next) => {
        if (ctx.path === '/auth') {
            const code = ctx.query.code
            if(!code){
                ctx.body = 'code not exist'
                return
            }
            // 获取token
            const result = await axios({
                method:'POST',
                url:request_token_url,
                data:{
                    client_id,
                    client_secret,
                    code
                },
                headers:{
                    Accept:'application/json'
                }
            })

            // code已被使用也会返回200
            if(result.status === 200 && (result.data && !result.data.error)){
                ctx.session.githubAuth = result.data

                const {access_token,token_type} = result.data

                const userInfo = await axios({
                    method:'GET',
                    url:request_userInfo_url,
                    headers:{
                        Authorization:`${token_type} ${access_token}`
                    }
                })

                ctx.session.userInfo = userInfo.data

                ctx.redirect((ctx.session && ctx.session.url)?ctx.session.url:'/')
            }else{
                const errorMsg = result.data && result.data.error

                ctx.body = `request token filed ${errorMsg}`
            }

        }else{
            await next()
        }
    })

    server.use(async (ctx,next)=>{
        const path = ctx.path
        const method = ctx.method

        if(path === '/logout' && method === 'POST'){
            ctx.session = null
            ctx.body = 'logout success'
        }else{
            await next()
        }
    })

    // 保存进行登录前的路径，登录完成后跳转到原路径
    server.use(async (ctx,next)=>{
        const path = ctx.path
        const method = ctx.method

        if(path === '/ready-auth' && method === 'GET'){
            ctx.session.url = ctx.query.url
            ctx.redirect(config.OAUTH_URL)
        }else{
            await next()
        }
    })
}