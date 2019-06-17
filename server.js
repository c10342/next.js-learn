const Koa = require('koa')

const Router = require('koa-router')

const session = require('koa-session')

const koaBody = require('koa-body')

const next = require('next')

const RedisSessionStroe = require('./server/session-store')

const Redis = require('ioredis')

const auth = require('./server/auth')

const github = require('./server/api')

const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })

const handler = app.getRequestHandler()

const redisClient = new Redis()

// 等待next编译完成
app.prepare().then(() => {
    const server = new Koa()
    const router = new Router()

    server.use(koaBody())

    server.keys = ['Github App'];
    const CONFIG = {
        key: 'koa:sess',
        store:new RedisSessionStroe(redisClient)
    };

    server.use(session(CONFIG, server));

    auth(server)
    github(server)

    server.use(router.routes())
    server.use(router.allowedMethods())

    server.use(async (ctx) => {
        ctx.req.session = ctx.session
        // 原生req,res
        await handler(ctx.req, ctx.res)
        ctx.respond = false
    })

    server.listen('3000', () => {
        console.log('localhost:3000')
    })
})