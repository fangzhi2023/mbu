import { Fragment, useEffect, useState } from "react"
import { Avatar, Spin } from "antd"
import { fetchAuthor } from "../../services/admin"
import "./Author.scss"
import { NavLink } from "react-router-dom"
import eventBus from "../../utils/event-bus"

function Author(props) {

    const { authorId } = props

    const [move, setMove] = useState(false)
    useEffect(() => {
        eventBus.subscribe("moveAuthorDialog", () => {
            setMove(true)
        })
    }, [])
    const handleMove = () => {
        setMove(false)
    }

    const [loading, setLoading] = useState(true)
    const [author, setAuthor] = useState({})
    useEffect(() => {
        async function fetchAuthorInfo() {
            const data = await fetchAuthor(authorId)
            setAuthor(data)
            setLoading(false)
        }
        fetchAuthorInfo()
    }, [authorId])

    const [listLoading, setListLoading] = useState(true)
    const [list, setList] = useState([])
    useEffect(() => {
        async function fetchAuthorList() {
            const data = await fetchAuthor(authorId)
            setList([1,2,3,4,5,6])
            setListLoading(false)
        }
        fetchAuthorList()
    }, [authorId])

    let clazz = "author mbu-sm-hide"
    if (!loading) {
        clazz += " animation"
    }
    if (move) {
        clazz += " move"
    }

    return <div className={ clazz }>
        <div className="info" onClick={handleMove}>
            <div className="avatar">
                <Avatar size="large" src={ author.avatar }></Avatar>  
            </div>      
            { loading 
                ? <Spin /> 
                : <Fragment>
                    <h3>{ author.name }</h3>
                    <small> 2022/03/22 </small>
                </Fragment>}
        </div>
        <div className="list">
            <h5>-- Ta 的分享 --</h5>
            { listLoading
                ? <Spin /> 
                : <ul>
                    { list.map(item => {
                       return <li key={item}>
                          <NavLink to={`/article/${item}` }>
                              <div className="title">标题标题标题标题标题标题标题标题标题</div>
                              <small>分享于: 2022/03/12</small>
                          </NavLink>
                        </li>
                    })}    
                </ul>
            }
        </div>
    </div>
}

export default Author