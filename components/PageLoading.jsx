import React from 'react'
import {Spin} from 'antd'


const PageLoading = () => {
    return (
        <div className='root'>
            <Spin />
            <style jsx>{`
            .root{
                position:fixed;
                top:0;
                left:0;
                right:0;
                bottom:0;
                background-color:rgba(255,255,255,0.3);
                display:flex;
                align-items:center;
                justify-content:center;
                z-index:1001;
            }
            `}</style>
        </div>
    )
}

export default PageLoading