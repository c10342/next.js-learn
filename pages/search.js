import { withRouter } from 'next/router'
const { request } = require('../lib/api')
import { List, Row, Col, Pagination } from 'antd'
import Link from 'next/link'
import React, { memo,useEffect } from 'react'
import Repo from '../components/Repo'
import {cacheArray,get, cache,cacheWithName} from '../lib/cache'

const pageSize = 10

const isServer = typeof window === 'undefined'

const LANGUAGES = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Rust']
const SORT_TYPES = [
    {
        name: 'Best match',
    },
    {
        name: 'Most stars',
        value: 'stars',
        order: 'desc',
    },
    {
        name: 'Fewest stars',
        value: 'stars',
        order: 'asc',
    },
    {
        name: 'Most forks',
        value: 'forks',
        order: 'desc',
    },
    {
        name: 'Fewest forks',
        value: 'forks',
        order: 'asc',
    },
]

const selectedItemStyle = {
    borderLeft: '2px solid #e36209',
    fontWeight: 100,
}

function noop() { }
let FilterLink = memo(({ name, query, lang, sort, order,page }) => {
    let href = `/search?query=${query}`
    if (lang) {
        href += `&lang=${lang}`
    }
    if (sort) {
        href += `&sort=${sort}&order=${order || 'desc'}`
    }
    if (page) {
        href += `&page=${page}`
      }

      href+=`&per_page=${pageSize}`

    // 分页组件的原始节点是一个a标签，为了防止出现 `<a> in </a>`
    // 这里对于是ReactElement的节点我们直接进行渲染，不再包裹一个 <a>
    return (
        <Link href={href}>{React.isValidElement(name) ? name : <a>{name}</a>}</Link>
    )
})

function makeQuery({ query, sort, lang, order, page }){
    let queryString = `?q=${query}`
        if (lang) queryString += `+language:${lang}`
        if (sort) queryString += `&sort=${sort}&order=${order || 'desc'}`
        if (page) queryString += `&page=${page}`

        queryString+=`&per_page=${pageSize}`

        return queryString
}

const Search = ({ router, repos }) => {
    const { page, ...querys } = router.query
    const { lang, sort, order } = router.query

    useEffect(()=>{
        if(!isServer){
            const queryString = makeQuery(router.query)
            cacheArray(repos.items)
            cacheWithName(queryString,repos)
        }
    })
    return (
        <div className="root">
            <Row gutter={20}>
                <Col span={6}>
                    <List
                        bordered
                        header={<span className="list-header">语言</span>}
                        style={{ marginBottom: 20 }}
                        dataSource={LANGUAGES}
                        renderItem={item => {
                            const selected = lang === item.toLowerCase()
                            return (
                                <List.Item style={selected ? selectedItemStyle : null}>
                                    {selected ? (
                                        <span>{item}</span>
                                    ) : (
                                            <FilterLink
                                                {...querys}
                                                name={item}
                                                lang={item.toLowerCase()}
                                            />
                                        )}
                                </List.Item>
                            )
                        }}
                    />
                    <List
                        header={<span className="list-header">排序</span>}
                        bordered
                        dataSource={SORT_TYPES}
                        renderItem={item => {
                            let selected = false
                            if (item.name === 'Best match' && !sort) {
                                selected = true
                            } else if (item.value === sort && item.order === order) {
                                selected = true
                            }
                            return (
                                <List.Item style={selected ? selectedItemStyle : null}>
                                    {selected ? (
                                        <span>{item.name}</span>
                                    ) : (
                                            <FilterLink
                                                {...querys}
                                                sort={item.value}
                                                order={item.order}
                                                name={item.name}
                                            />
                                        )}
                                </List.Item>
                            )
                        }}
                    />
                </Col>
                <Col span={18}>
                    <h3 className="repos-title">{repos.total_count} 个仓库</h3>
                    {repos.items.map(repo => (
                        <Repo repo={repo} key={repo.id} />
                    ))}
                    <div className="pagination">
                        <Pagination
                            pageSize={pageSize}
                            current={Number(page) || 1}
                            total={repos.total_count<=1000?repos.total_count:1000}
                            onChange={noop}
                            itemRender={(page, type, ol) => {
                                const name = type === 'page' ? page : ol
                                return <FilterLink {...querys} page={page} name={name} />
                            }}
                        />
                    </div>
                </Col>
            </Row>
            <style jsx>{`
          .root {
            padding: 20px 0;
          }
          .list-header {
            font-weight: 800;
            font-size: 16px;
          }
          .repos-title {
            border-bottom: 1px solid #eee;
            font-size: 24px;
            line-height: 50px;
          }
          .pagination {
            padding: 20px;
            text-align: center;
          }
        `}</style>
        </div>
    )
}

Search.getInitialProps = async ({ router, ctx }) => {
    try {
        const { query, sort, lang, order, page } = ctx.query
        if (!query) {
            return {
                repos: {
                    total_count: 0,
                    items:[]
                },
            }
        }
        // let queryString = `?q=${query}`
        // if (lang) queryString += `+language:${lang}`
        // if (sort) queryString += `&sort=${sort}&order=${order || 'desc'}`
        // if (page) queryString += `&page=${page}`

        // queryString+=`&per_page=${pageSize}`
        let queryString = makeQuery(ctx.query)
        if(!isServer){
            if(get(queryString)){
                return {
                    repos:get(queryString)
                }
            }
        }

        const { status, data } = await request({ url: `/github/search/repositories${queryString}`, req: ctx.req, res: ctx.res })
        if (status === 200) {
            return {
                repos: data
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export default withRouter(Search)