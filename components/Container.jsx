import React,{cloneElement} from 'react'

const style = {
    width:'100%',
    maxWidth:1600,
    marginLeft:'auto',
    marginRight:'auto',
    paddingLeft:20,
    paddingRight:20
}

const Container = ({children,render=<div />})=>{
    return cloneElement(render,{
        style:Object.assign({},render.props.style,style),
        children
    })
}


export default Container