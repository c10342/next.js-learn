const axios = require('axios')

const github_base_url = 'https://api.github.com'

// 用于服务器发请求
const serverRequest = async ({ method, url, data, headers }) => {
    return await axios({
        method,
        url: `${github_base_url}${url}`,
        data,
        headers
    })
}

// 客户端发请求
const clientRequest = async ({ method, url, data, headers }) => {
    return await axios({
        method,
        url: `${url}`,
        data,
        headers
    })
}

// 同构，处理差异
const request = async ({ method = 'get', url, data = {}, headers = {}, req, res }) => {
    if (!url) throw Error('url must be provide')
    const isServer = typeof window === 'undefined'
    if (isServer) {
        let headers = {}
        const session = req.session
        if (session && session.githubAuth) {
            headers['Authorization'] = `${session.githubAuth.token_type} ${session.githubAuth.access_token}`
        }
        url = url.replace('/github/', '/')
        const result = await serverRequest({ method, url, data, headers })
        return result
    } else {
        const result = await clientRequest({ method, url, data, headers })
        return result
    }
}


module.exports = { request, serverRequest }