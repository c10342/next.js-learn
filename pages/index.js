import React, { useEffect } from 'react'
import { connect } from 'react-redux'
const { request } = require('../lib/api')
import { Button, Icon, Tabs } from 'antd'
import Router, { withRouter } from 'next/router'
import Repo from '../components/Repo'
import Lru from 'lru-cache'

let cacheUserRepos
let cacheUserStaredRepos
const isServe = typeof window === 'undefined'

// 使用第三方缓存策略
const lru = new Lru({maxAge:1000*60*10})

const Index = ({ userRepos, userStaredRepos, user, router }) => {
    if (!user || !user.id) {
        return (
            <div className="root">
                <p>亲，你还没有登录哦～</p>
                <Button type="primary" href={`/ready-auth?url=${router.asPath}`}>
                    点击登录
            </Button>
                <style jsx>{`
              .root {
                height: 400px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }
            `}</style>
            </div>
        )
    }

    const activeKey = router.query.key ? router.query.key : '1'
    useEffect(() => {
        if (!isServe) { //不能再服务器端缓存数据，否则后面进来的会共享同一份数据
            // if(userRepos && userStaredRepos){
            //     cacheUserRepos = userRepos
            //     cacheUserStaredRepos = userStaredRepos
            // }
            if(userRepos){
                lru.set('userRepos',userRepos)
            }
            if(userStaredRepos){
                lru.set('userStaredRepos',userStaredRepos)
            }
        }
    },[userRepos, userStaredRepos])
    const handlerChange = (activeKey) => {
        router.push(`/?key=${activeKey}`)
    }
    return (
        <div className="root">
            <div className="user-info">
                <img src={user.avatar_url} alt="" className="avatar" />
                <span className="login">{user.login}</span>
                <span className="name">{user.name}</span>
                <span className="bio">{user.bio}</span>
                <p className="mail">
                    <Icon type="mail" style={{ marginRight: 10 }} />
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                </p>
            </div>
            <div className="user-repos">
                <Tabs activeKey={activeKey} onChange={handlerChange} animated={false}>
                    <Tabs.TabPane tab="你的仓库" key="1">
                        <div>
                            {userRepos.map(repo => (
                                <Repo repo={repo} key={repo.id} />
                            ))}
                        </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="你关注的仓库" key="2">
                        <div>
                            {userStaredRepos.map(repo => (
                                <Repo repo={repo} key={repo.id} />
                            ))}
                        </div>
                    </Tabs.TabPane>
                </Tabs>
            </div>
            <style jsx>
                {`
              .root {
                display: flex;
                align-items: flex-start;
                padding: 20px 0;
              }
              .user-info {
                width: 200px;
                margin-right: 40px;
                flex-shrink: 0;
                display: flex;
                flex-direction: column;
              }
              .login {
                font-weight: 800;
                font-size: 20px;
                margin-top: 20px;
              }
              .name {
                font-size: 16px;
                color: #777;
              }
              .bio {
                margin-top: 20px;
                color: #333;
              }
              .avatar {
                width: 100%;
                border-radius: 5px;
              }
              .user-repos {
                flex-grow: 1;
              }
            `}
            </style>
        </div>)
}

Index.getInitialProps = async ({ reduxStore, ctx }) => {
    try {
        const { req, res } = ctx
        const user = reduxStore.getState().user
        if (!user || !user.id) {
            return { isLogin: false }
        }

        // if (!isServe) {
        //     if (cacheUserRepos && cacheUserStaredRepos) {
        //         return {
        //             userRepos: cacheUserRepos,
        //             userStaredRepos: cacheUserRepos,
        //             isLogin: true
        //         }
        //     }
        // }

        if (!isServe) {
            if (lru.get('userRepos') && lru.get('userStaredRepos')) {
                return {
                    userRepos: lru.get('userRepos'),
                    userStaredRepos: lru.get('userStaredRepos'),
                    isLogin: true
                }
            }
        }

        const userRepos = await request({ url: '/github/user/repos', req, res })
        const userStaredRepos = await request({ url: '/github/user/starred', req, res })
        return {
            userRepos: userRepos.data,
            userStaredRepos: userStaredRepos.data,
            isLogin: true
        }
    } catch (error) {
        console.log('Index.getInitialProps  error')
        console.log(error)
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}


// withRouter可能会跟redux冲突，所以需要放在最外面
export default withRouter(connect(mapStateToProps)(Index))