import {withRouter} from 'next/router'

const Search = ({router})=>{
    return (
        <div>{router.query.query}</div>
    )
}

export default withRouter(Search)