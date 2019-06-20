import MarkdownIt from 'markdown-it'
import 'github-markdown-css'

import {memo,useMemo} from 'react'

const md = new MarkdownIt({
    html:true,
    linkify:true
})

function b64_to_utf8(str){
    // 解决atob转化出来中文乱码问题
    return decodeURIComponent(escape(atob(str)))
}

  
export default memo(function MarkdownRender({content,isBase64}){
    const con = isBase64?b64_to_utf8(content):content
    let html = useMemo(()=>md.render(con),[con])
    return (
        <div className='markdown-body'>
            <div dangerouslySetInnerHTML={{__html:html}}></div>
        </div>
    )
})