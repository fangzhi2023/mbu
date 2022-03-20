
import { Spin, message } from 'antd';
import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router';
import { dynamicLoad } from "../../editors"

import "./index.scss"

import { fetchSuite } from '../../services/suite';
import { getDefaultId } from '../../layouts/HeaderLayout';

function Suite(props) { 
    
    let { id } = useParams()
    if (!id) id = getDefaultId("suite")

    const { editing = false } = props

    const { state } = useLocation()
    let [uKey, setUKey] = useState(null)
    if (state && state.layoutKey != uKey) {
        setUKey(state.layoutKey)
    }

    let [loading, setLoading] = useState(true)
    let [editor, setEditor] = useState({
        component: null,
        data: null
    })
    
    const navigate = useNavigate()
    useEffect(() => {
        setLoading(true)
        async function fetchSuiteData() {
            try {
                const data = await fetchSuite(id)
                const component = await dynamicLoad(data.type)
                setEditor({
                    ... data,
                    name: data.type,
                    component: component.default
                })
                setLoading(false) 
            } catch (err) {
                switch(err.code) {
                    case 401:
                        navigate("/shared/401")
                        return
                    case 404:
                        navigate("/shared/404")
                        return
                    default:
                        message.warn(err.message)
                }
            }
        }
        fetchSuiteData()
    }, [id, uKey])

    return (
        <div className="suite">
            { loading ? <Spin tip="加载数据..." /> : <editor.component name={editor.name} id={editor.id} data={editor.data} editing={editing} />}
        </div>
    )
}

export default Suite;