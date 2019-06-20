import { useState, useCallback, useRef } from 'react'

import { Select, Spin } from 'antd'

import { request } from '../lib/api'

import debounce from 'lodash/debounce'


const Option = Select.Option 


function SearchUser({onChange,value}) {
    // {current:0} 可以用来逃避hooks的闭包
    let fetchId = useRef(0)
    const [fetching, setFetching] = useState(false)
    const [options, setOptions] = useState([])
    const fetchUser = useCallback(debounce(value => {
        fetchId.current+=1
        const id = fetchId.current
        setFetching(true)
        setOptions([])
        request({ url: `/github/search/users?q=${value}` }).then((res) => {
            // 处理发出多次请求问题，只处理最后一次发出的请求
            if(id!==fetchId.current){
                return
            }
            if (res.data.items) {
                const data = res.data.items.map(user => {
                    return {
                        text: user.login,
                        value: user.login
                    }
                })
                setOptions(data)
            }else{
                setOptions([])
            }

            setFetching(false)
        })
    },500), [])

    const handlerChange = useCallback((val)=>{
        setOptions([])
        setFetching(false)
        onChange(val)
    },[])

    return (
        <Select
            style={{ width: 200}}
            showSearch={true}
            notFoundContent={fetching ? <Spin size='small' /> : null}
            filterOption={false}
            placeholder='创建者'
            onSearch={fetchUser}
            onChange={handlerChange}
            allowClear={true}
            value={value}
        >
            {
                options.map(op => {
                    return <Option value={op.value} key={op.value}>{op.text}</Option>
                })
            }
        </Select>
    )
}

export default SearchUser