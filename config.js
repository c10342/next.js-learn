const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'
const client_id = '6e95753a7b8956d13562'

module.exports = {
    github: {
        request_userInfo_url: 'https://api.github.com/user',
        request_token_url: 'https://github.com/login/oauth/access_token',
        client_id,
        client_secret: 'd52fd28fb4cfda54fa9f1ff0b59a8db3d43e890c'
    },
    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${
        client_id
        }&scope=${SCOPE}`,
    GITHUB_OAUTH_URL
}