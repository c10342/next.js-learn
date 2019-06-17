import {useState,useEffect,useReducer,useLayoutEffect,useContext,useRef,useMemo,useCallback,memo} from 'react'
import MyContext from '../lib/my-context'

function countReducer(state,action){
    switch(action.type){
        case 'add':
        return state+1
        case "minus":
        return state-1
        default:
        return state
    }
}

function count(){
    // const [count,setCount] = useState(0)
    const [count,dispatchCount] = useReducer(countReducer,0)

    const [name,setName] = useState('zhangsan')

    const dom = useRef()
    // 插入DOM后
    useEffect(()=>{
        const interval = setInterval(()=>{
            // setCount(c=>c+1)
            // dispatchCount({type:'add'})
            // console.log(dom.current)
        },1000)
        return ()=>clearInterval(interval)
    },[]) //第二个参数不传入，每次组件更新useEffect会被调用多次。[count]：count改变会重新执行useEffect，没传入的不会重新执行useEffect
    
    // 插入DOM前，一般很少使用
    // useLayoutEffect(()=>{
    //     console.log('useLayoutEffect start')
    //     return ()=>console.log('useLayoutEffect end')
    // },[])

    const context = useContext(MyContext)

    // 每次重新执行该组件时只有 count发生变化才会重新生成该对象，否则用的还是上一次的，配合memo
    const config = useMemo(
        ()=>{
            return {
                text:`count is ${count}`
            }
        },
        [count]
    )

    // 跟useMemo 同理，可用useMemo改写  配合memo
    const btnClick = useCallback(()=>{
        // console.log('click')
        dispatchCount({type:'add'})
    },[])

    return (
        <div>
            <span ref={dom}>{count}</span>
            <span>{context}</span>
            <input value={name} onChange={e=>setName(e.target.value)} />
            {/* <button onClick={btnClick}>点击</button> */}
            <Child  btnClick={btnClick} config={config}/>
        </div>
    )
}

// memo渲染优化，componentShouldUpdate

const Child = memo(function ({btnClick,config}){
    console.log('child')
    return (
        <button onClick={btnClick}>{config.text}</button>
    )
})

export default count