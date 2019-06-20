import Repo from './Repo'

import Link from 'next/link'

import { withRouter } from 'next/router'

const { request } = require('../lib/api')

import {cache,get} from '../lib/cache'

import {useEffect} from 'react'

const isServer = typeof window === 'undefined'

function makeQuery(queryObject) {
    const query = Object.entries(queryObject)
        .reduce((result, entry) => {
            result.push(entry.join('='))
            return result
        }, []).join('&')
    return `?${query}`
}

export default function (Comp, tabs = 'index') {
    const WithDetail = ({ repoBasic, router, ...rest }) => {
        const query = makeQuery(router.query)
        useEffect(()=>{
            if(!isServer){
                cache(repoBasic)
            }
        })
        return (
            <div className='root'>
                <div className='repo-basic'>
                    <Repo repo={repoBasic} />
                    <div className='tabs'>
                        {tabs == 'index' ? <span className='tab'>Readme</span> : (
                            <Link href={`/detail${query}`}>
                                <a className='tab index'>Readme</a>
                            </Link>
                        )}
                        {tabs == 'issues' ? <span className='tab'>Issues</span> : (<Link href={`/detail/issues${query}`}>
                            <a className='tab issues'>Issues</a>
                        </Link>)}
                    </div>
                </div>
                <div><Comp {...rest} /></div>
                <style jsx>{`
              .root {
                padding-top: 20px;
              }
              .repo-basic {
                padding: 20px;
                border: 1px solid #eee;
                margin-bottom: 20px;
                border-radius: 5px;
              }
              .tab + .tab {
                margin-left: 20px;
              }
              .tab.active {
                color: #777;
                cursor: default;
              }
            `}</style>
            </div>
        )
    }

    WithDetail.getInitialProps = async (ctx) => {
        try {
            const { owner, name } = ctx.ctx.query

            let pageData
            if (Comp.getInitialProps) {
                pageData = await Comp.getInitialProps(ctx)
            }

            if(!isServer){
                if(get(`${owner}/${name}`)){
                    return { repoBasic: get(`${owner}/${name}`), ...pageData }
                }
            }

            const repoBasic = await request({ url: `/github/repos/${owner}/${name}`,req:ctx.ctx.req,res:ctx.ctx.res })
            return { repoBasic: repoBasic.data, ...pageData }
        } catch (error) {
            console.log(error)
        }

    }

    return withRouter(WithDetail)
}



