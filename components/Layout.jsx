import React,{useState,useCallback} from 'react'
import {Layout,Icon,Input,Avatar,Tooltip,Dropdown,Menu} from 'antd'
const { Header, Content, Footer } = Layout;
import Container from '../components/Container'
import {connect} from 'react-redux'
import getConfig from 'next/config'
import {logout} from '../store/action/user'
import {withRouter} from 'next/router'
import Link from 'next/link'

const {publicRuntimeConfig} = getConfig()


const githubIconStyle = {
    color:'white',
    fontSize:40,
    display:'block',
    marginRight:10
}

const MyLayout = ({children,user,logout,router}) => {

    const [search,setSearch] = useState(router.query.query || '')

    const handlerSearchChange = useCallback(e=>{
        setSearch(e.target.value)
    },[])
    const handlerSearch = useCallback(e=>{
        router.push(`/search?query=${search}`)
    },[search])
    const handlerLogout = useCallback(e=>{
        logout()
    },[logout])
    const userDropdown = (
        <Menu>
            <Menu.Item>
                <a href="javascript:void(0)" onClick={handlerLogout}>退出</a>
            </Menu.Item>
        </Menu>
    )
    return (
        <Layout>
            <Header>
                <Container render={<div className='header-inner'/>}>
                    <div className='header-left'>
                        <Link href='/'>
                            <Icon type='github' style={githubIconStyle} />
                        </Link>
                        <Input.Search 
                        value={search}
                        onChange={handlerSearchChange}
                        onSearch={handlerSearch}
                        placeholder='请输入' />
                    </div>
                    <div className='header-right'>
                        {(user&&user.id)?(
                            <Dropdown overlay={userDropdown}>
                                <a href="/">
                                <Avatar size={40} src={user.avatar_url} />
                                </a>
                            </Dropdown>
                        ):(
                            <Tooltip title='点击进行登录'>
                            {/* router.asPath显示在浏览器上的路径 */}
                                <a href={`/ready-auth?url=${router.asPath}`}>
                                    <Avatar size={40} icon='user' />
                                </a>
                            </Tooltip>
                        )}
                    </div>
                </Container>
            </Header>
            <Content>
                <Container>
                    {children}
                </Container>
            </Content>
            <Footer>
                <div>c10342</div>
            </Footer>
            <style jsx>{`
            .header-inner{
                display:flex;
                justify-content:space-between;
                align-items: center;
                height:100%;
            }
            .header-left{
                display:flex;
                justify-content: center;
                align-items: center;
            }
            `}</style>
            <style jsx global>{`
            #__next{
                height:100%;
            }
            .ant-layout{
                height:100%;
            }
            .ant-layout-header{
                margin:0;
            }
            `}</style>
        </Layout>
    )
}

const mapStateToProps = state =>{
    return {
        user:state.user
    }
}

const mapActionToProps = {
    logout
}

export default connect(mapStateToProps,mapActionToProps)(withRouter(MyLayout))

