import { Fragment, useEffect, useState } from "react"
import { Avatar, Spin } from "antd"
import { fetchAuthorInfo, fetchAuthorShare } from "../../services/shared"
import "./Author.scss"
import { NavLink } from "react-router-dom"
import eventBus from "../../utils/event-bus"

function Author(props) {

    const { authorId } = props

    const [move, setMove] = useState(false)
    useEffect(() => {
        const sub = eventBus.subscribe("moveAuthorDialog", () => {
            setMove(true)
        })
        return () => {
            sub.unsubscribe()
        }
    }, [])
    const handleMove = () => {
        setMove(false)
    }

    const [loading, setLoading] = useState(true)
    const [author, setAuthor] = useState({})
    useEffect(() => {
        async function fetchAuthor() {
            setLoading(true)
            try {
                const data = await fetchAuthorInfo(authorId)
                setAuthor(data)
                setLoading(false)
            } catch(error) {
                setLoading(false)
            }
        }
        fetchAuthor()
    }, [authorId])

    const [listLoading, setListLoading] = useState(true)
    const [list, setList] = useState([])
    useEffect(() => {
        async function fetchAuthorList() {
            setListLoading(true)
            try {
                const list = await fetchAuthorShare(authorId)
                setList(list)
                setListLoading(false)
            } catch(error) {
                setListLoading(false)
            }
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
                    <h3>{ author.name || author.phone }</h3>
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