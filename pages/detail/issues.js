import WithDetail from '../../components/with-detail'
import { request } from '../../lib/api'
import { useState, useCallback } from 'react'
import { Button, Avatar, Select, Spin } from 'antd'
import dynamic from 'next/dynamic'
import SearchUser from '../../components/SearchUser'
import { get, cacheWithName } from '../../lib/cache'

const MarkdownRender = dynamic(() => import('../../components/MarkdownRender'), {
  loading: () => <p>loading</p>
})

function IssueDetail({ issue }) {
  function goToGithubIssue() {
    window.open(issue.html_url)
  }

  return (
    <div className="root">
      <MarkdownRender content={issue.body} />
      <div className="actions">
        <Button onClick={goToGithubIssue}>打开Issue讨论页面</Button>
      </div>
      <style jsx>{`
          .root {
            background-color: #efefef;
            padding: 20px;
          }
          .actions {
            text-align: right;
          }
        `}</style>
    </div>
  )
}
function Label({ label }) {
  return (
    <>
      <span className="label" style={{ backgroundColor: `#${label.color}` }}>
        {label.name}
      </span>
      <style jsx>{`
          .label {
            display: inline-block;
            line-height: 20px;
            padding:3px 10px;
            border-radius:5px;
          }
          .label {
            margin-left: 10px;
          }
        `}</style>
    </>
  )
}

function IssueItem({ issue }) {
  const [showDetail, setShowDetail] = useState(false)
  const toggleShowDetail = useCallback(() => {
    setShowDetail(d => !d)
  }, [])


  return (
    <div>
      <div className="issue">
        <Button
          type="primary"
          size="small"
          style={{ position: 'absolute', right: 20, top: 10 }}
          onClick={toggleShowDetail}
        >
          {showDetail ? '隐藏内容' : '显示内容'}
        </Button>
        <div className="avatar">
          <Avatar src={issue.user.avatar_url} shape="square" size={50} />
        </div>
        <div className="main-info">
          <h6>
            <span>{issue.title}</span>
            {issue.labels.map(label => (
              <Label key={label.id} label={label} />
            ))}
          </h6>
          <p className="sub-info">
            <span>Updated at {issue.updated_at}</span>
          </p>
        </div>
        <style jsx>{`
            .issue {
              display: flex;
              position: relative;
              padding: 10px;
            }
            .issue:hover {
              background: #fafafa;
            }
            .issue + .issue {
              border-top: 1px solid #eee;
            }
            .main-info > h6 {
              max-width: 600px;
            }
            .avatar {
              margin-right: 20px;
            }
            .main-info > h6 {
              font-size: 16px;
            }
            .sub-info {
              margin-bottom: 0;
            }
            .sub-info > span + span {
              display: inline-block;
              margin-left: 20px;
              font-size: 12px;
            }
          `}</style>
      </div>
      {showDetail ? <IssueDetail issue={issue} /> : null}
    </div>
  )
}

const Option = Select.Option

function makeQuery({ creator, state, label: labels }) {
  let creatorStr = creator ? `creator=${creator}` : ''
  let stateStr = state ? `state=${state}` : ''
  let labelsStr = ''
  if (labels && labels.length > 0) {
    labelsStr = `labels=${labels.join(',')}`
  }

  const arr = []

  if (creatorStr) arr.push(creatorStr)
  if (stateStr) arr.push(stateStr)
  if (labelsStr) arr.push(labelsStr)

  return `?${arr.join('&')}`
}

const isServer = typeof window === 'undefined'

const Issues = ({ issues, labels, owner, name }) => {
  if (!isServer) {
    cacheWithName(`/repos/${owner}/${name}/issues`, issues)
    cacheWithName(`/repos/${owner}/${name}/labels`, labels)
  }
  const [creator, setCreator] = useState()
  const handlerCreatorChange = useCallback(val => {
    setCreator(val)
  }, [])
  const [state, setState] = useState()
  const handlerStateChange = useCallback(val => {
    setState(val)
  }, [])
  const [label, setLabel] = useState()
  const handlerLabelChange = useCallback(val => {
    setLabel(val)
  }, [])
  const [search, setSearch] = useState(issues)
  const handlerSearchChange = useCallback(val => {
    setFetching(true)
    request({ url: `/github/repos/${owner}/${name}/issues${makeQuery({ creator, state, label })}` }).then(res => {
      if (res.status === 200) {
        setSearch(res.data)
      }
      setFetching(false)
    }).catch(error => {
      setFetching(false)
      console.log(error)
    })
  }, [creator, state, label, owner, name])

  const [fetching, setFetching] = useState(false)
  return (
    <div className="root">
      <div style={{ display: 'flex', padding: 20 }}>
        <SearchUser onChange={handlerCreatorChange} value={creator} />

        <Select placeholder='状态' style={{ width: 200, marginLeft: 20 }} value={state} onChange={handlerStateChange}>
          <Option value='all'>all</Option>
          <Option value='open'>open</Option>
          <Option value='closed'>closed</Option>
        </Select>
        <Select mode='multiple' placeholder='label' style={{ width: 200, marginLeft: 20, marginRight: 20, flexGrow: 1 }} value={label} onChange={handlerLabelChange}>
          {
            labels.map(la => (
              <Option value={la.name} key={la.id}>{la.name}</Option>
            ))
          }
        </Select>
        <Button disabled={fetching} onClick={handlerSearchChange} type='primary'>搜索</Button></div>
      <div>
        {
          fetching ? <div className='loading'><Spin /></div> : (
            search.map(issue => (
              <IssueItem issue={issue} key={issue.id} />
            ))
          )
        }
      </div>
      <style jsx>{`
        .root {
          border: 1px solid #eee;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .loading{
          height:300px;
          text-align:center;
          line-height:300px;
        }
      `}</style>
    </div>
  )
}

Issues.getInitialProps = async ({ ctx }) => {
  try {
    const { owner, name } = ctx.query

    if (!isServer) {
      const i = get(`/repos/${owner}/${name}/issues`)
      const l = get(`/repos/${owner}/${name}/labels`)
      if (i && l) {
        return {
          issues: i,
          labels: l,
          owner, name
        }
      }
    }
    // 并行发送请求
    const fetch = await Promise.all([
      request({
        url: `/github/repos/${owner}/${name}/issues`,
        req: ctx.req, res: ctx.res
      }),
      request({
        url: `/github/repos/${owner}/${name}/labels`,
        req: ctx.req, res: ctx.res
      })
    ])


    return {
      issues: fetch[0].data,
      labels: fetch[1].data,
      owner, name
    }
  } catch (error) {
    console.log(error)
  }

}

export default WithDetail(Issues, 'issues')