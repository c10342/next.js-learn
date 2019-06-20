import WithDetail from '../../components/with-detail'
import {request} from '../../lib/api'

import dynamic from 'next/dynamic'

import {get,cacheWithName} from '../../lib/cache'

const MarkdownRender = dynamic(()=>import('../../components/MarkdownRender'),{
    loading:()=><p>loading</p>
})

const isServer = typeof window === 'undefined'

const Detail = ({readmeResp,name,owner}) => {
    
    if(readmeResp && readmeResp.content){
        if(!isServer){
            cacheWithName(`/github/repos/${owner}/${name}/readme`,readmeResp)
        }
        return <MarkdownRender content={readmeResp.content} isBase64={true} />
    }

    return <div>无</div>
}

Detail.getInitialProps = async ({ ctx:{query:{owner,name},req,res} }) => {
    try {

        if(!isServer){
            if(get(`/github/repos/${owner}/${name}/readme`)){
                return {
                    readmeResp:get(`/github/repos/${owner}/${name}/readme`),
                    owner,
                    name
                }
            }
        }
        const readmeResp = await request({
            url:`/github/repos/${owner}/${name}/readme`,
            req,res
        })
        return {
            readmeResp:readmeResp.data,
            owner,
            name
        }
    } catch (error) {
        console.log(error)
    }

}

export default WithDetail(Detail)